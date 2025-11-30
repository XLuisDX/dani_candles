import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { orderId, items, currency } = body as {
      orderId: string;
      items: {
        name: string;
        quantity: number;
        unit_amount_cents: number;
      }[];
      currency: string;
    };

    if (!orderId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing order data" },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabase
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
      "http://localhost:3000";

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
