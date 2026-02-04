"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  AdminOrderDetail,
  AdminOrderItem,
  NEXT_STEPS,
  OrderStatus,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/types/types";
import { toast } from "@/components/Toast";

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [items, setItems] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/admin/orders?id=${orderId}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/auth/login");
            return;
          }
          if (res.status === 404) {
            setError("Order not found.");
            setLoading(false);
            return;
          }
          throw new Error(data.error || "Could not load order");
        }

        setOrder(data.order as AdminOrderDetail);
        setItems((data.items || []) as AdminOrderItem[]);
      } catch (err) {
        console.error("Error loading order:", err);
        setError("Could not load this order.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, router]);

  const changeStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    setUpdatingStatus(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ orderId: order.id, status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Error updating order:", data.error);
        setError("Could not update order status.");
        toast.error("Update failed", "Could not update order status");
      } else {
        setOrder(data.order as AdminOrderDetail);
        toast.success(`Order marked as ${STATUS_LABELS[newStatus].toLowerCase()}`);

        if (newStatus === "shipped") {
          void fetch("/api/admin/order-status-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ orderId: order.id }),
          }).catch((err) => {
            console.error(
              "[AdminOrderDetail] Error calling order-status-email:",
              err
            );
          });
        }
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <main className="relative mx-auto max-w-6xl px-6 py-8 md:py-12 lg:px-8 overflow-y-hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#1a1a1a]/90"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2.5 w-2.5 rounded-full bg-dc-caramel"
          />
          <p className="text-sm font-medium text-dc-ink/70 dark:text-white/70">Loading order...</p>
        </motion.div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="relative mx-auto max-w-6xl px-6 py-8 md:py-12 lg:px-8 overflow-y-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-red-500/20 bg-red-50/50 px-6 py-5 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400"
        >
          {error ?? "Order not found."}
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => router.push("/admin/orders")}
          className="mt-6 inline-flex items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/80 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
        >
          Back to orders
        </motion.button>
      </main>
    );
  }

  const createdAtLabel = order.created_at
    ? new Date(order.created_at).toLocaleString()
    : "—";
  const total = (order.total_cents / 100).toFixed(2);
  const shippingName = order.shipping_address?.full_name ?? "—";
  const nextStatuses = NEXT_STEPS[order.status] ?? [];

  return (
    <main className="relative mx-auto max-w-6xl space-y-8 px-6 py-16 md:py-20 lg:px-8">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ x: -4 }}
        type="button"
        onClick={() => router.push("/admin/orders")}
        className="relative inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/55 transition-colors hover:text-dc-caramel dark:text-white/55"
      >
        <span aria-hidden>←</span> Back to orders
      </motion.button>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 md:p-10"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60">
                Order detail
              </span>
            </motion.div>

            <h1 className="mt-6 font-display text-3xl font-semibold leading-tight text-dc-ink dark:text-white md:text-4xl">
              Order{" "}
              <span className="font-mono text-xl text-dc-ink/70 dark:text-white/70">
                {order.id}
              </span>
            </h1>

            <p className="mt-3 text-sm font-medium text-dc-ink/60 dark:text-white/60">
              Placed on {createdAtLabel}
            </p>

            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-dc-ink/40 dark:text-white/40">
              Payment status:{" "}
              <span className="font-bold text-dc-ink/70 dark:text-white/70">
                {order.payment_status}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <span
              className={`inline-flex items-center rounded-full border px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] ${STATUS_COLORS[order.status]}`}
            >
              {STATUS_LABELS[order.status]}
            </span>

            {nextStatuses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {nextStatuses.map((st) => (
                  <motion.button
                    key={st}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => changeStatus(st)}
                    className="inline-flex items-center justify-center rounded-full border border-dc-caramel/20 bg-dc-sand/40 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-clay shadow-sm transition-all duration-200 hover:border-dc-caramel/30 hover:bg-dc-sand/60 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dc-caramel/10 dark:text-dc-caramel"
                  >
                    Set as {STATUS_LABELS[st]}
                  </motion.button>
                ))}
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-1 rounded-2xl border border-red-500/20 bg-red-50/80 px-5 py-3 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]"
      >
        <section className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60">
            Items
          </h2>

          {items.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-dc-sand/20 px-5 py-4 text-sm font-medium text-dc-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
              No items found for this order.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {items.map((item, index) => {
                const unit = (item.unit_price_cents / 100).toFixed(2);
                const line = (item.total_cents / 100).toFixed(2);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-dc-ink/8 bg-white/80 px-5 py-4 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-lg font-semibold leading-tight text-dc-ink dark:text-white">
                        {item.product_name}
                      </p>
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-dc-ink/40 dark:text-white/40">
                        Qty {item.quantity} · {unit} {order.currency_code} each
                      </p>
                    </div>

                    <p className="shrink-0 text-base font-bold text-dc-ink dark:text-white">
                      {line}{" "}
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40">
                        {order.currency_code}
                      </span>
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95"
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60">
              Customer & shipping
            </h2>

            <div className="mt-6 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40">
                  Name
                </p>
                <p className="mt-1.5 text-sm font-semibold text-dc-ink dark:text-white">
                  {shippingName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40">
                  Email
                </p>
                <p className="mt-1.5 text-sm font-semibold text-dc-ink dark:text-white">
                  {order.customer_email ?? "—"}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-dc-sand/20 px-5 py-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/50 dark:text-white/50">
                Address
              </p>
              <p className="mt-3 text-sm leading-relaxed text-dc-ink/70 dark:text-white/70">
                {order.shipping_address?.line1 || "—"}
                {order.shipping_address?.line2
                  ? `, ${order.shipping_address.line2}`
                  : ""}
                <br />
                {order.shipping_address?.city}, {order.shipping_address?.state}{" "}
                {order.shipping_address?.postal_code}
                <br />
                {order.shipping_address?.country}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95"
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60">
              Summary
            </h2>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-dc-ink/60 dark:text-white/60">
                Total
              </span>
              <span className="text-xl font-bold text-dc-ink dark:text-white">
                {total}{" "}
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40">
                  {order.currency_code}
                </span>
              </span>
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-dc-ink/40 dark:text-white/40">
              Taxes and shipping were calculated at checkout.
            </p>
          </motion.div>
        </section>
      </motion.div>
    </main>
  );
}
