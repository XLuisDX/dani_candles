import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";
import { z } from "zod";

const createOrderSchema = z.object({
  shippingAddress: z.object({
    full_name: z.string().min(1),
    line1: z.string().min(1),
    line2: z.string().nullable().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postal_code: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().nullable().optional(),
  }),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      name: z.string().min(1),
      priceCents: z.number().int().min(0),
      quantity: z.number().int().min(1),
    })
  ).min(1),
  subtotalCents: z.number().int().min(0),
  shippingCents: z.number().int().min(0).default(0),
  taxCents: z.number().int().min(0).default(0),
  totalCents: z.number().int().min(0),
  currencyCode: z.string().length(3).default("USD"),
});

async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    // If orderId is provided, return single order with items (for confirmation page)
    // This is accessible without auth since order IDs are UUIDs (hard to guess)
    if (orderId) {
      console.log("[/api/orders] Fetching single order:", orderId);

      const { data: order, error: orderError } = await supabaseServer
        .from("orders")
        .select(
          "id, placed_at, created_at, status, total_cents, currency_code, shipping_address"
        )
        .eq("id", orderId)
        .maybeSingle();

      if (orderError) {
        console.error("[/api/orders] Error loading order:", orderError);
        return NextResponse.json(
          { error: "Could not load order" },
          { status: 500 }
        );
      }

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      // Load order items
      const { data: items, error: itemsError } = await supabaseServer
        .from("order_items")
        .select("id, product_name, quantity, total_cents")
        .eq("order_id", orderId);

      if (itemsError) {
        console.error("[/api/orders] Error loading order items:", itemsError);
      }

      return NextResponse.json({ order, items: items || [] });
    }

    // For listing all orders, require authentication
    const user = await getAuthenticatedUser();

    if (!user) {
      console.log("[/api/orders] No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[/api/orders] Fetching orders for user:", user.id);

    const { data, error } = await supabaseServer
      .from("orders")
      .select("id, placed_at, created_at, status, total_cents, currency_code")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[/api/orders] Supabase error:", error);
      return NextResponse.json(
        { error: "Could not load orders", details: error.message },
        { status: 500 }
      );
    }

    console.log("[/api/orders] Found orders:", data?.length || 0);
    return NextResponse.json({ orders: data || [] });
  } catch (error) {
    console.error("[/api/orders] API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      console.log("[/api/orders POST] No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate request body
    const validation = createOrderSchema.safeParse(body);
    if (!validation.success) {
      console.error("[/api/orders POST] Validation error:", validation.error.flatten());
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const {
      shippingAddress,
      items,
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
      currencyCode,
    } = validation.data;

    console.log("[/api/orders POST] Creating order for user:", user.id);

    // Create order using service role key (bypasses RLS)
    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .insert({
        user_id: user.id,
        customer_email: user.email,
        status: "pending",
        payment_status: "pending",
        payment_provider: "stripe",
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        tax_cents: taxCents,
        total_cents: totalCents,
        currency_code: currencyCode,
        shipping_address: shippingAddress,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("[/api/orders POST] Error creating order:", orderError);
      return NextResponse.json(
        { error: "Could not create order", details: orderError?.message },
        { status: 500 }
      );
    }

    console.log("[/api/orders POST] Order created:", order.id);

    // Create order items
    const orderItemsPayload = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      unit_price_cents: item.priceCents,
      quantity: item.quantity,
      total_cents: item.priceCents * item.quantity,
      variant_data: null,
    }));

    const { error: itemsError } = await supabaseServer
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error("[/api/orders POST] Error creating order items:", itemsError);
      // Try to clean up the order if items failed
      await supabaseServer.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Could not create order items", details: itemsError.message },
        { status: 500 }
      );
    }

    console.log("[/api/orders POST] Order items created for order:", order.id);

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("[/api/orders POST] API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
