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
      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20 mt-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-5"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-dc-caramel sm:h-2.5 sm:w-2.5"
          />
          <p className="text-xs font-medium text-dc-ink/70 sm:text-sm">
            Loading your order...
          </p>
        </motion.div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20 mt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-red-500/20 bg-red-50/50 px-4 py-4 text-xs font-medium text-red-700 sm:rounded-3xl sm:px-6 sm:py-5 sm:text-sm"
        >
          {error ?? "Order not found."}
        </motion.div>
      </main>
    );
  }

  const totalFormatted = (order.total_cents / 100).toFixed(2);
  const shippingName = order.shipping_address?.full_name;

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20 mt-0">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -top-16 right-8 h-40 w-40 rounded-full bg-dc-sand blur-3xl sm:right-12 sm:h-48 sm:w-48 md:right-16 md:h-56 md:w-56"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -bottom-16 left-8 h-48 w-48 rounded-full bg-dc-caramel blur-3xl sm:left-12 sm:h-56 sm:w-56 md:h-64 md:w-64"
      />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl sm:rounded-3xl sm:p-8 md:p-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 shadow-sm sm:gap-2.5 sm:px-5 sm:py-2"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-emerald-600"
          />
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-emerald-800 sm:text-[10px]">
            Order confirmed
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 font-display text-3xl font-semibold leading-tight text-dc-ink sm:mt-5 sm:text-4xl md:mt-6 md:text-5xl lg:text-6xl"
        >
          Thank you for your order
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-3 text-sm leading-relaxed text-dc-ink/60 sm:mt-4 sm:text-base"
        >
          Your order{" "}
          <span className="inline-flex rounded-full border border-dc-ink/10 bg-white/80 px-3 py-1 font-mono text-xs font-medium text-dc-ink shadow-sm sm:px-4 sm:py-1.5 sm:text-sm">
            {order.id}
          </span>{" "}
          has been placed. We&apos;ll email you when it ships.
        </motion.p>
      </motion.header>

      <div className="mt-8 grid gap-6 sm:mt-10 md:mt-12 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-8">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl sm:rounded-3xl sm:p-8 md:p-10"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div>
              <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/50 sm:text-[10px]">
                Order details
              </h2>
              {shippingName && (
                <p className="mt-3 text-xs text-dc-ink/70 sm:mt-4 sm:text-sm">
                  <span className="text-dc-ink/50">Ship to: </span>
                  <span className="font-semibold text-dc-ink">
                    {shippingName}
                  </span>
                </p>
              )}
            </div>

            <span className="inline-flex w-fit items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-emerald-800 shadow-sm sm:px-4 sm:py-2 sm:text-[9px]">
              Confirmed
            </span>
          </div>

          <ul className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
            {items.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                whileHover={{ x: 4 }}
                className="flex items-start justify-between gap-3 rounded-xl border border-dc-ink/8 bg-white/80 px-4 py-3.5 sm:gap-4 sm:rounded-2xl sm:px-5 sm:py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-dc-ink sm:text-base">
                    {item.product_name}
                  </p>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40 sm:mt-1.5 sm:text-[10px]">
                    Qty {item.quantity}
                  </p>
                </div>

                <p className="text-sm font-bold text-dc-ink sm:text-base">
                  {(item.total_cents / 100).toFixed(2)}{" "}
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 sm:text-[10px]">
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
          className="h-fit rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl sm:rounded-3xl sm:p-8 md:sticky md:top-6"
        >
          <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 sm:text-[10px]">
            Summary
          </h2>

          <div className="mt-5 rounded-xl border border-dc-ink/8 bg-white/80 px-5 py-4 sm:mt-6 sm:rounded-2xl sm:px-6 sm:py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-dc-ink/60">
                Total
              </span>
              <span className="text-xl font-bold text-dc-ink sm:text-2xl">
                {totalFormatted}{" "}
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 sm:text-[10px]">
                  {order.currency_code}
                </span>
              </span>
            </div>
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40 sm:mt-3 sm:text-[10px]">
              Taxes and shipping were calculated at checkout.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => router.push("/shop")}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-dc-caramel px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 sm:mt-8 sm:h-12 sm:text-[10px]"
          >
            Continue shopping
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => router.push("/account/orders")}
            className="mt-2.5 inline-flex h-11 w-full items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/30 sm:mt-3 sm:h-12 sm:text-[10px]"
          >
            View order history
          </motion.button>
        </motion.aside>
      </div>
    </main>
  );
}