import * as React from "react";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabaseServer";
import { resend } from "@/lib/resend";
import type Stripe from "stripe";
import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail";
import { OrderItemEmail, ShippingAddress } from "@/types/types";

export async function GET() {
  console.log("[Stripe webhook] GET ping");
  return NextResponse.json({
    ok: true,
    message: "Stripe webhook endpoint is alive",
  });
}

export async function POST(req: NextRequest) {
  console.log("[Stripe webhook] Incoming POST");

  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Stripe webhook] Missing STRIPE_WEBHOOK_SECRET env var");
    return NextResponse.json(
      { error: "Missing Stripe webhook secret" },
      { status: 500 }
    );
  }

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    // Always verify webhook signature for security
    // Use Stripe CLI for local testing: stripe listen --forward-to localhost:3000/api/stripe/webhook
    if (!sig) {
      console.error("[Stripe webhook] Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    console.log("[Stripe webhook] Event verified:", event.type);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error verifying signature";
    console.error("[Stripe webhook] Signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  try {
    console.log("[Stripe webhook] Handling event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId as string | undefined;
      const paymentIntentId = session.payment_intent as string | undefined;
      const customerEmail = session.customer_details?.email;

      console.log(
        "[Stripe webhook] checkout.session.completed for orderId:",
        orderId,
        "paymentIntentId:",
        paymentIntentId,
        "customerEmail:",
        customerEmail
      );

      if (!orderId) {
        console.warn(
          "[Stripe webhook] No orderId found in session.metadata. Skipping."
        );
      } else if (!customerEmail) {
        console.warn(
          "[Stripe webhook] No customer email found in session. Skipping email."
        );
      } else {
        const { data: order, error: updateError } = await supabaseServer
          .from("orders")
          .update({
            status: "paid",
            payment_status: "succeeded",
            payment_provider: "stripe",
            payment_id: paymentIntentId ?? null,
            customer_email: customerEmail,
          })
          .eq("id", orderId)
          .select("id, total_cents, currency_code, shipping_address")
          .maybeSingle();

        if (updateError) {
          console.error(
            "[Stripe webhook] Error updating order status:",
            updateError
          );
        } else if (!order) {
          console.error(
            "[Stripe webhook] Order not found for update:",
            orderId
          );
        } else {
          console.log(
            "[Stripe webhook] Order updated to paid:",
            order.id,
            "total_cents:",
            order.total_cents
          );

          const { data: orderItems, error: itemsError } = await supabaseServer
            .from("order_items")
            .select("product_name, quantity, unit_price_cents, total_cents")
            .eq("order_id", orderId);

          if (itemsError) {
            console.error(
              "[Stripe webhook] Error loading order_items for email:",
              itemsError
            );
          }

          const items: OrderItemEmail[] =
            orderItems?.map((item) => ({
              name: item.product_name as string,
              quantity: item.quantity as number,
              unitPriceFormatted: (
                (item.unit_price_cents as number) / 100
              ).toFixed(2),
              lineTotalFormatted: ((item.total_cents as number) / 100).toFixed(
                2
              ),
            })) ?? [];

          const totalFormatted = (order.total_cents / 100).toFixed(2);
          const shippingRaw = (order.shipping_address ?? {}) as Record<
            string,
            unknown
          >;

          const shippingName =
            (shippingRaw.name as string | undefined) ??
            (shippingRaw.full_name as string | undefined) ??
            session.customer_details?.name ??
            "Customer";

          const shippingAddress: ShippingAddress = {
            full_name: shippingName,
            line1: (shippingRaw.line1 as string | undefined) ?? "",
            line2: (shippingRaw.line2 as string | undefined) ?? "",
            city: (shippingRaw.city as string | undefined) ?? "",
            state: (shippingRaw.state as string | undefined) ?? "",
            postal_code: (shippingRaw.postal_code as string | undefined) ?? "",
            country: (shippingRaw.country as string | undefined) ?? "",
          };

          const fromEmail =
            process.env.ORDER_FROM_EMAIL ||
            "Dani Candles <onboarding@resend.dev>";
          const ownerEmail = process.env.ORDER_NOTIFICATIONS_EMAIL || null;

          const textBody = [
            `Hi ${shippingName},`,
            "",
            `Thank you for your order with Dani Candles ✨`,
            "",
            `Order ID: ${order.id}`,
            `Total: ${totalFormatted} ${order.currency_code}`,
            "",
            `We will let you know as soon as your candles ship.`,
            "",
            `With warmth,`,
            `Dani Candles`,
          ].join("\n");

          try {
            const { data: customerResult, error: customerError } =
              await resend.emails.send({
                from: fromEmail,
                to: customerEmail,
                subject: `Your Dani Candles order is confirmed`,
                react: React.createElement(OrderConfirmationEmail, {
                  orderId: order.id,
                  totalFormatted,
                  currencyCode: order.currency_code,
                  customerName: shippingName,
                  items,
                  shippingAddress,
                }),
                text: textBody,
              });

            console.log(
              "[Stripe webhook] Resend customer email result:",
              customerResult
            );
            if (customerError) {
              console.error(
                "[Stripe webhook] Resend customer email error:",
                customerError
              );
            } else {
              console.log(
                "[Stripe webhook] ✅ Confirmation email sent successfully to:",
                customerEmail
              );
            }
          } catch (emailError) {
            console.error(
              "[Stripe webhook] Failed to send confirmation email:",
              emailError
            );
          }

          if (ownerEmail) {
            try {
              const { data: ownerResult, error: ownerError } =
                await resend.emails.send({
                  from: fromEmail,
                  to: ownerEmail,
                  subject: `New order received: ${order.id}`,
                  text: `New order ${order.id} from ${shippingName} (${customerEmail}). Total: ${totalFormatted} ${order.currency_code}.`,
                });

              console.log(
                "[Stripe webhook] Resend owner email result:",
                ownerResult
              );
              if (ownerError) {
                console.error(
                  "[Stripe webhook] Resend owner email error:",
                  ownerError
                );
              }
            } catch (ownerEmailError) {
              console.error(
                "[Stripe webhook] Failed to send owner notification:",
                ownerEmailError
              );
            }
          }
        }
      }
    } else {
      console.log(
        "[Stripe webhook] Event type not handled explicitly:",
        event.type
      );
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error in webhook handler";
    console.error("[Stripe webhook] Handler error:", message);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }
}