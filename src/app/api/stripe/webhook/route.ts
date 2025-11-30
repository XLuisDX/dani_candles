// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabaseServer";
import { resend } from "@/lib/resend";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const payload = await req.text();
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed.", errorMessage);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId as string | undefined;
      const paymentIntentId = session.payment_intent as string | undefined;

      if (!orderId) {
        console.warn("No orderId in session metadata");
      } else {
        const { data: updatedOrders, error: updateError } = await supabaseServer
          .from("orders")
          .update({
            status: "paid",
            payment_status: "succeeded",
            payment_provider: "stripe",
            payment_id: paymentIntentId ?? null,
          })
          .eq("id", orderId)
          .select("id, user_id, total_cents, currency_code, shipping_address")
          .limit(1);

        if (updateError || !updatedOrders || updatedOrders.length === 0) {
          console.error("Error updating order status:", updateError);
        } else {
          const order = updatedOrders[0];

          if (!order.user_id) {
            console.warn("Order has no user_id, skipping email");
          } else {
            const { data: userData, error: userError } =
              await supabaseServer.auth.admin.getUserById(order.user_id);

            if (userError || !userData?.user) {
              console.error("Error fetching user for order email:", userError);
            } else {
              const customerEmail = userData.user.email;
              if (!customerEmail) {
                console.warn("User has no email, skipping email send");
              } else {
                const ownerEmail =
                  process.env.ORDER_NOTIFICATIONS_EMAIL ?? customerEmail;
                const fromEmail =
                  process.env.ORDER_FROM_EMAIL ??
                  "Dani Candles <orders@example.com>";

                const totalFormatted = (order.total_cents / 100).toFixed(2);
                const shippingName =
                  order.shipping_address?.full_name ?? "Customer";

                const textBody = [
                  `Hi ${shippingName},`,
                  "",
                  `Thank you for your order with Dani Candles ✨`,
                  "",
                  `Order ID: ${order.id}`,
                  `Total: ${totalFormatted} ${order.currency_code}`,
                  "",
                  `We’ll let you know as soon as your candles ship.`,
                  "",
                  `With warmth,`,
                  `Dani Candles`,
                ].join("\n");

                await resend.emails.send({
                  from: fromEmail,
                  to: customerEmail,
                  subject: `Your Dani Candles order ${order.id} is confirmed`,
                  text: textBody,
                });

                if (ownerEmail && ownerEmail !== customerEmail) {
                  await resend.emails.send({
                    from: fromEmail,
                    to: ownerEmail,
                    subject: `New order received: ${order.id}`,
                    text: `New order ${order.id} from ${shippingName} (${customerEmail}). Total: ${totalFormatted} ${order.currency_code}.`,
                  });
                }
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }
}
