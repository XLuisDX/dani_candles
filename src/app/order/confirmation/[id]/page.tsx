"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCartStore } from "@/store/cartStore";
import { Order, OrderItem } from "@/types/types";

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (!order) return;

    if (order.status === "paid") {
      clearCart();
    }
  }, [order, clearCart]);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(
          "id, total_cents, currency_code, placed_at, status, shipping_address"
        )
        .eq("id", orderId)
        .maybeSingle();

      if (orderError || !orderData) {
        setError("Order not found.");
        setLoading(false);
        return;
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("id, product_name, quantity, total_cents")
        .eq("order_id", orderId);

      if (itemsError) {
        setError("Could not load order items.");
        setLoading(false);
        return;
      }

      setOrder(orderData as Order);
      setItems(itemsData as OrderItem[]);
      setLoading(false);
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2.5 w-2.5 rounded-full bg-dc-caramel"
          />
          <p className="text-sm font-medium text-dc-ink/70">
            Loading your order...
          </p>
        </motion.div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-red-500/20 bg-red-50/50 px-6 py-5 text-sm font-medium text-red-700"
        >
          {error ?? "Order not found."}
        </motion.div>
      </main>
    );
  }

  const totalFormatted = (order.total_cents / 100).toFixed(2);
  const shippingName = order.shipping_address?.full_name;

  return (
    <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-8">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -top-16 right-16 h-56 w-56 rounded-full bg-dc-sand blur-3xl"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -bottom-16 left-12 h-64 w-64 rounded-full bg-dc-caramel blur-3xl"
      />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl md:p-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 shadow-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-emerald-600"
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-800">
            Order confirmed
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl"
        >
          Thank you for your order
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 text-base leading-relaxed text-dc-ink/60"
        >
          Your order{" "}
          <span className="inline-flex rounded-full border border-dc-ink/10 bg-white/80 px-4 py-1.5 font-mono text-sm font-medium text-dc-ink shadow-sm">
            {order.id}
          </span>{" "}
          has been placed. We&apos;ll email you when it ships.
        </motion.p>
      </motion.header>

      <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl md:p-10"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/50">
                Order details
              </h2>
              {shippingName && (
                <p className="mt-4 text-sm text-dc-ink/70">
                  <span className="text-dc-ink/50">Ship to: </span>
                  <span className="font-semibold text-dc-ink">
                    {shippingName}
                  </span>
                </p>
              )}
            </div>

            <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-800 shadow-sm">
              Confirmed
            </span>
          </div>

          <ul className="mt-8 space-y-4">
            {items.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                whileHover={{ x: 4 }}
                className="flex items-start justify-between gap-4 rounded-2xl border border-dc-ink/8 bg-white/80 px-5 py-4"
              >
                <div>
                  <p className="text-base font-semibold text-dc-ink">
                    {item.product_name}
                  </p>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40">
                    Qty {item.quantity}
                  </p>
                </div>

                <p className="text-base font-bold text-dc-ink">
                  {(item.total_cents / 100).toFixed(2)}{" "}
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                    {order.currency_code}
                  </span>
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="h-fit rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl md:sticky md:top-6"
        >
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
            Summary
          </h2>

          <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-white/80 px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-dc-ink/60">
                Total
              </span>
              <span className="text-2xl font-bold text-dc-ink">
                {totalFormatted}{" "}
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                  {order.currency_code}
                </span>
              </span>
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40">
              Taxes and shipping were calculated at checkout.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => router.push("/shop")}
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-dc-caramel px-6 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
          >
            Continue shopping
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => router.push("/account/orders")}
            className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-6 text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/30"
          >
            View order history
          </motion.button>
        </motion.aside>
      </div>
    </main>
  );
}