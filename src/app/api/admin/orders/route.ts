import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isAdminEmail } from "@/lib/isAdmin";
import { supabaseServer } from "@/lib/supabaseServer";

async function getAuthenticatedAdmin() {
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

  const email = user.email ?? null;
  if (!isAdminEmail(email)) {
    return null;
  }

  return user;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    // If orderId is provided, return single order with items
    if (orderId) {
      const { data: order, error: orderError } = await supabaseServer
        .from("orders")
        .select(
          "id, created_at, status, payment_status, total_cents, currency_code, customer_email, shipping_address"
        )
        .eq("id", orderId)
        .maybeSingle();

      if (orderError) {
        console.error("[/api/admin/orders] Error loading order:", orderError);
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
        .select("id, product_name, quantity, unit_price_cents, total_cents")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });

      if (itemsError) {
        console.error("[/api/admin/orders] Error loading order items:", itemsError);
      }

      return NextResponse.json({ order, items: items || [] });
    }

    // Otherwise, return list of all orders
    const { data, error } = await supabaseServer
      .from("orders")
      .select(
        "id, created_at, status, payment_status, total_cents, currency_code, customer_email, shipping_address"
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("[/api/admin/orders] Error loading orders:", error);
      return NextResponse.json(
        { error: "Could not load orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders: data });
  } catch (error) {
    console.error("[/api/admin/orders] API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select(
        "id, created_at, status, payment_status, total_cents, currency_code, customer_email, shipping_address"
      )
      .single();

    if (error || !data) {
      console.error("Error updating order:", error);
      return NextResponse.json(
        { error: "Could not update order status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
