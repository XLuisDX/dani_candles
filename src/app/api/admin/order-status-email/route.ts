import * as React from "react";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { resend } from "@/lib/resend";
import OrderShippedEmail from "@/emails/OrderShippedEmail";
import { OrderShippedItemEmail, ShippingAddress } from "@/types/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body as { orderId?: string };

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .select(
        "id, status, total_cents, currency_code, customer_email, shipping_address"
      )
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("[Order status email] Order not found:", orderError);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "shipped") {
      console.log(
        "[Order status email] Order is not shipped, skipping email. Status:",
        order.status
      );
      return NextResponse.json({
        ok: false,
        reason: "Order is not shipped",
      });
    }

    const customerEmail = order.customer_email as string | null;
    if (!customerEmail) {
      console.warn(
        `[Order status email] Order ${order.id} has no customer_email; skipping email.`
      );
      return NextResponse.json({
        ok: false,
        reason: "No customer email",
      });
    }

    const { data: orderItems, error: itemsError } = await supabaseServer
      .from("order_items")
      .select("product_name, quantity, total_cents")
      .eq("order_id", orderId);

    if (itemsError) {
      console.error(
        "[Order status email] Error loading order_items:",
        itemsError
      );
    }

    const items: OrderShippedItemEmail[] =
      orderItems?.map((item) => ({
        name: item.product_name as string,
        quantity: item.quantity as number,
        lineTotalFormatted: ((item.total_cents as number) / 100).toFixed(2),
      })) ?? [];

    const totalFormatted = (order.total_cents / 100).toFixed(2);
    const shippingRaw = (order.shipping_address ?? {}) as Record<
      string,
      unknown
    >;
    const shippingName =
      (shippingRaw.full_name as string | undefined) ?? "Customer";

    const shippingAddress: ShippingAddress = {
      full_name: (shippingRaw.name as string) ?? "",
      line1: (shippingRaw.line1 as string | undefined) ?? "",
      line2: (shippingRaw.line2 as string | undefined) ?? "",
      city: (shippingRaw.city as string | undefined) ?? "",
      state: (shippingRaw.state as string | undefined) ?? "",
      postal_code: (shippingRaw.postal_code as string | undefined) ?? "",
      country: (shippingRaw.country as string | undefined) ?? "",
    };

    const fromEmail =
      process.env.ORDER_FROM_EMAIL || "Dani Candles <orders@danicandles.com>";

    const textBody = [
      `Hi ${shippingName},`,
      "",
      `Good news – your Dani Candles order is on its way ✨`,
      "",
      `Order ID: ${order.id}`,
      `Total: ${totalFormatted} ${order.currency_code}`,
      "",
      `Thank you for supporting Dani Candles.`,
      "",
      `With warmth,`,
      `Dani Candles`,
    ].join("\n");

    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject: `Your Dani Candles order ${order.id} has shipped`,
      react: React.createElement(OrderShippedEmail, {
        orderId: order.id,
        totalFormatted,
        currencyCode: order.currency_code,
        customerName: shippingName,
        items,
        shippingAddress,
      }),
      text: textBody,
    });

    console.log("[Order status email] Resend result:", emailResult);
    if (emailError) {
      console.error("[Order status email] Resend error:", emailError);
      return NextResponse.json(
        { ok: false, error: emailError },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Order status email] Handler error:", message);
    return NextResponse.json(
      { error: "Handler error", message },
      { status: 500 }
    );
  }
}
