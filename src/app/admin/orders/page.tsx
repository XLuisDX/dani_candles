"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/isAdmin";
import { AdminOrderDetail, OrderStatus } from "@/types/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  preparing: "Preparing",
  shipped: "Shipped",
  delivered: "Delivered",
  canceled: "Canceled",
  refunded: "Refunded",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "border-amber-500/30 text-amber-800 bg-amber-500/10",
  paid: "border-emerald-500/30 text-emerald-700 bg-emerald-500/10",
  preparing: "border-sky-500/30 text-sky-700 bg-sky-500/10",
  shipped: "border-sky-500/30 text-sky-700 bg-sky-500/10",
  delivered: "border-emerald-500/30 text-emerald-700 bg-emerald-500/10",
  canceled: "border-red-500/30 text-red-700 bg-red-500/10",
  refunded: "border-purple-500/30 text-purple-700 bg-purple-500/10",
};

const NEXT_STEPS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending: ["paid", "canceled"],
  paid: ["preparing", "shipped", "canceled"],
  preparing: ["shipped", "canceled"],
  shipped: ["delivered"],
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/auth/login");
        return;
      }
      const email = data.user.email ?? null;
      if (!isAdminEmail(email)) {
        router.push("/");
        return;
      }
    };
    checkAdmin();
  }, [router]);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, created_at, status, payment_status, total_cents, currency_code, customer_email, shipping_address"
        )
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error(error);
        setError("Could not load orders.");
      } else {
        setOrders(data as AdminOrderDetail[]);
      }

      setLoading(false);
    };

    loadOrders();
  }, []);

  const visibleOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const changeStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId)
        .select(
          "id, created_at, status, payment_status, total_cents, currency_code, customer_email, shipping_address"
        )
        .single();

      if (error || !data) {
        console.error(error);
        setError("Could not update order status.");
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? (data as AdminOrderDetail) : o))
        );

        if (newStatus === "shipped") {
          void fetch("/api/admin/order-status-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
          }).catch((err) => {
            console.error(
              "[AdminOrders] Error calling order-status-email:",
              err
            );
          });
        }
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <main className="relative mx-auto max-w-7xl px-6 py-8 md:py-12 lg:px-8">
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

      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm backdrop-blur-sm"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60">
              Admin
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl"
          >
            Orders
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 text-base leading-relaxed text-dc-ink/60"
          >
            View and manage customer orders for Dani Candles.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <label className="sr-only" htmlFor="statusFilter">
            Filter status
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as OrderStatus | "all")
            }
            className="h-11 rounded-full border border-dc-ink/10 bg-white/80 px-5 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/80 shadow-sm outline-none transition-all focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="preparing">Preparing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
            <option value="refunded">Refunded</option>
          </select>
        </motion.div>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-12 flex items-center gap-4 rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2.5 w-2.5 rounded-full bg-dc-caramel"
          />
          <p className="text-sm font-medium text-dc-ink/70">
            Loading orders...
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mt-12 rounded-2xl border border-red-500/20 bg-red-50/50 px-6 py-5 text-sm font-medium text-red-700"
        >
          {error}
        </motion.div>
      )}

      {!loading && visibleOrders.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative mt-12 rounded-3xl border border-dc-ink/8 bg-white/95 p-10 shadow-sm backdrop-blur-xl"
        >
          <p className="text-base text-dc-ink/60">
            No orders found for this filter.
          </p>
        </motion.div>
      )}

      {!loading && visibleOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-dc-ink/8 bg-white/95 shadow-lg backdrop-blur-xl"
        >
          <div className="grid grid-cols-[1.6fr_1.1fr_1fr_1fr_1.4fr] gap-4 border-b border-dc-ink/8 bg-dc-sand/10 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/50">
            <span>Order</span>
            <span>Date</span>
            <span>Status</span>
            <span>Total</span>
            <span>Customer</span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {visibleOrders.map((order) => {
              const dateLabel = order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "—";
              const total = (order.total_cents / 100).toFixed(2);
              const shippingName = order.shipping_address?.full_name ?? "—";
              const nextStatuses = NEXT_STEPS[order.status] ?? [];

              return (
                <motion.div
                  key={order.id}
                  className="border-b border-dc-ink/5 px-6 py-6 text-sm text-dc-ink"
                >
                  <div className="grid grid-cols-[1.6fr_1.1fr_1fr_1fr_1.4fr] gap-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-medium text-dc-ink/70">
                        {order.id}
                      </span>
                      <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40">
                        Payment: {order.payment_status}
                      </span>
                    </div>

                    <span className="text-xs font-medium text-dc-ink/55">
                      {dateLabel}
                    </span>

                    <span>
                      <span
                        className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] ${STATUS_COLORS[order.status]}`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </span>

                    <span className="text-base font-bold text-dc-ink">
                      {total}{" "}
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                        {order.currency_code}
                      </span>
                    </span>

                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-dc-ink">
                        {shippingName}
                      </span>
                      <span className="mt-1.5 text-[10px] font-medium text-dc-ink/50">
                        {order.customer_email ?? "No email"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-dc-ink/5 pt-5 md:flex-row md:items-center md:justify-between">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="inline-flex items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/80 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
                    >
                      View details
                    </motion.button>

                    {nextStatuses.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {nextStatuses.map((st) => (
                          <motion.button
                            key={st}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            disabled={updatingId === order.id}
                            onClick={() => changeStatus(order.id, st)}
                            className="inline-flex items-center justify-center rounded-full border border-dc-caramel/20 bg-dc-sand/40 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-clay shadow-sm transition-all duration-200 hover:border-dc-caramel/30 hover:bg-dc-sand/60 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Set as {STATUS_LABELS[st]}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}