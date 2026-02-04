import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabaseServer";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rateLimit";
import { z } from "zod";

const checkoutSchema = z.object({
  orderId: z.string().uuid(),
  items: z.array(
    z.object({
      name: z.string().min(1).max(200),
      quantity: z.number().int().min(1).max(100),
      unit_amount_cents: z.number().int().min(0),
    })
  ).min(1),
  currency: z.string().length(3),
});

export async function POST(req: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(req.headers);
  const rateLimitResult = rateLimit(`checkout:${clientIp}`, RATE_LIMITS.checkout);
  if (!rateLimitResult.success) {
    return rateLimitResult.error;
  }

  try {
    const body = await req.json();

    // Validate request body
    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { orderId, items, currency } = validation.data;

    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .select("id, total_cents, currency_code")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const origin =
      req.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://www.danicandles.com/";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: item.name,
          },
          unit_amount: item.unit_amount_cents,
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: orderId,
      },
      success_url: `${origin}/order/confirmation/${orderId}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error("[CHECKOUT_SESSION_ERROR]", err);
    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 }
    );
  }
}
