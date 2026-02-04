"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Order, OrderItem } from "@/types/types";

function DecorativeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-1/2 top-32 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-gradient-to-br from-dc-sand/40 to-dc-cream/20 blur-3xl dark:from-dc-caramel/10 dark:to-transparent sm:h-[400px] sm:w-[400px] md:top-40"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute left-1/4 top-[60%] h-[200px] w-[200px] -translate-x-1/2 rounded-full border border-dc-caramel/10 dark:border-dc-caramel/5 sm:h-[280px] sm:w-[280px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute right-1/3 top-[45%] h-2 w-2 rounded-full bg-dc-caramel/20 dark:bg-dc-caramel/10 sm:h-3 sm:w-3"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.2 }}
        className="absolute right-1/4 top-[70%] h-[250px] w-[250px] translate-x-1/2 rounded-full bg-gradient-to-tl from-dc-cream/30 to-transparent blur-3xl dark:from-dc-caramel/5 sm:h-[350px] sm:w-[350px]"
      />
    </div>
  );
}

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

      try {
        const res = await fetch(`/api/orders?id=${orderId}`);
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 404) {
            setError("Order not found.");
          } else {
            setError(data.error || "Could not load order.");
          }
          setLoading(false);
          return;
        }

        setOrder(data.order as Order);
        setItems((data.items || []) as OrderItem[]);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Could not load order.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20 mt-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#1a1a1a]/90 sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-5"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-dc-caramel sm:h-2.5 sm:w-2.5"
          />
          <p className="text-xs font-medium text-dc-ink/70 dark:text-white/70 sm:text-sm">
            Loading your order...
          </p>
        </motion.div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20 mt-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-red-500/20 bg-red-50/50 px-4 py-4 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400 sm:rounded-3xl sm:px-6 sm:py-5 sm:text-sm"
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
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-8 md:p-10"
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
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-emerald-800 dark:text-emerald-400 sm:text-[10px]">
            Order confirmed
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 font-display text-3xl font-semibold leading-tight text-dc-ink dark:text-white sm:mt-5 sm:text-4xl md:mt-6 md:text-5xl lg:text-6xl"
        >
          Thank you for your order
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-3 text-sm leading-relaxed text-dc-ink/60 dark:text-white/60 sm:mt-4 sm:text-base"
        >
          Your order{" "}
          <span className="inline-flex rounded-full border border-dc-ink/10 bg-white/80 px-3 py-1 font-mono text-xs font-medium text-dc-ink shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white sm:px-4 sm:py-1.5 sm:text-sm">
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
          className="rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-8 md:p-10"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div>
              <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/50 dark:text-white/50 sm:text-[10px]">
                Order details
              </h2>
              {shippingName && (
                <p className="mt-3 text-xs text-dc-ink/70 dark:text-white/70 sm:mt-4 sm:text-sm">
                  <span className="text-dc-ink/50 dark:text-white/50">Ship to: </span>
                  <span className="font-semibold text-dc-ink dark:text-white">
                    {shippingName}
                  </span>
                </p>
              )}
            </div>

            <span className="inline-flex w-fit items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400 shadow-sm sm:px-4 sm:py-2 sm:text-[9px]">
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
                className="flex items-start justify-between gap-3 rounded-xl border border-dc-ink/8 bg-white/80 px-4 py-3.5 dark:border-white/10 dark:bg-white/5 sm:gap-4 sm:rounded-2xl sm:px-5 sm:py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-dc-ink dark:text-white sm:text-base">
                    {item.product_name}
                  </p>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40 dark:text-white/40 sm:mt-1.5 sm:text-[10px]">
                    Qty {item.quantity}
                  </p>
                </div>

                <p className="text-sm font-bold text-dc-ink dark:text-white sm:text-base">
                  {(item.total_cents / 100).toFixed(2)}{" "}
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40 sm:text-[10px]">
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
          className="h-fit rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-8 md:sticky md:top-6"
        >
          <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
            Summary
          </h2>

          <div className="mt-5 rounded-xl border border-dc-ink/8 bg-white/80 px-5 py-4 dark:border-white/10 dark:bg-white/5 sm:mt-6 sm:rounded-2xl sm:px-6 sm:py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-dc-ink/60 dark:text-white/60">
                Total
              </span>
              <span className="text-xl font-bold text-dc-ink dark:text-white sm:text-2xl">
                {totalFormatted}{" "}
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40 sm:text-[10px]">
                  {order.currency_code}
                </span>
              </span>
            </div>
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40 dark:text-white/40 sm:mt-3 sm:text-[10px]">
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
            className="mt-2.5 inline-flex h-11 w-full items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/30 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white sm:mt-3 sm:h-12 sm:text-[10px]"
          >
            View order history
          </motion.button>
        </motion.aside>
      </div>
    </main>
  );
}