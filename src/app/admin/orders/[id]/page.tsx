"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/isAdmin";

type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "canceled"
  | "refunded";

interface ShippingAddress {
  full_name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

interface AdminOrderDetail {
  id: string;
  created_at: string | null;
  status: OrderStatus;
  payment_status: string;
  total_cents: number;
  currency_code: string;
  customer_email: string | null;
  shipping_address: ShippingAddress | null;
}

interface AdminOrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
}

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
    const loadOrder = async () => {
      setLoading(true);
      setError(null);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(
          "id, created_at, status, payment_status, total_cents, currency_code, customer_email, shipping_address"
        )
        .eq("id", orderId)
        .single();

      if (orderError || !orderData) {
        console.error(orderError);
        setError("Could not load this order.");
        setLoading(false);
        return;
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("id, product_name, quantity, unit_price_cents, total_cents")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });

      if (itemsError) {
        console.error(itemsError);
        setError("Could not load order items.");
        setItems([]);
      } else {
        setItems(itemsData as AdminOrderItem[]);
      }

      setOrder(orderData as AdminOrderDetail);
      setLoading(false);
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const changeStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    setUpdatingStatus(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", order.id)
        .select(
          "id, created_at, status, payment_status, total_cents, currency_code, customer_email, shipping_address"
        )
        .single();

      if (error || !data) {
        console.error(error);
        setError("Could not update order status.");
      } else {
        setOrder(data as AdminOrderDetail);

        if (newStatus === "shipped") {
          void fetch("/api/admin/order-status-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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
      <main className="relative mx-auto max-w-6xl px-6 py-8 md:py-12 lg:px-8">
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
          <p className="text-sm font-medium text-dc-ink/70">Loading order...</p>
        </motion.div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="relative mx-auto max-w-6xl px-6 py-8 md:py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-red-500/20 bg-red-50/50 px-6 py-5 text-sm font-medium text-red-700"
        >
          {error ?? "Order not found."}
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => router.push("/admin/orders")}
          className="mt-6 inline-flex items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/80 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
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
  const shipping = order.shipping_address ?? {};
  const shippingName = shipping.full_name ?? "—";
  const nextStatuses = NEXT_STEPS[order.status] ?? [];

  return (
    <main className="relative mx-auto max-w-6xl space-y-8 px-6 py-16 md:py-20 lg:px-8">
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

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ x: -4 }}
        type="button"
        onClick={() => router.push("/admin/orders")}
        className="relative inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/55 transition-colors hover:text-dc-caramel"
      >
        <span aria-hidden>←</span> Back to orders
      </motion.button>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl md:p-10"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm"
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
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60">
                Order detail
              </span>
            </motion.div>

            <h1 className="mt-6 font-display text-3xl font-semibold leading-tight text-dc-ink md:text-4xl">
              Order{" "}
              <span className="font-mono text-xl text-dc-ink/70">
                {order.id}
              </span>
            </h1>

            <p className="mt-3 text-sm font-medium text-dc-ink/60">
              Placed on {createdAtLabel}
            </p>

            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-dc-ink/40">
              Payment status:{" "}
              <span className="font-bold text-dc-ink/70">
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
                    className="inline-flex items-center justify-center rounded-full border border-dc-caramel/20 bg-dc-sand/40 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-clay shadow-sm transition-all duration-200 hover:border-dc-caramel/30 hover:bg-dc-sand/60 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="mt-1 rounded-2xl border border-red-500/20 bg-red-50/80 px-5 py-3 text-xs font-medium text-red-700"
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
        <section className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
            Items
          </h2>

          {items.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-dc-sand/20 px-5 py-4 text-sm font-medium text-dc-ink/60">
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
                    className="flex items-start justify-between gap-4 rounded-2xl border border-dc-ink/8 bg-white/80 px-5 py-4 transition-colors hover:bg-white"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-lg font-semibold leading-tight text-dc-ink">
                        {item.product_name}
                      </p>
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-dc-ink/40">
                        Qty {item.quantity} · {unit} {order.currency_code} each
                      </p>
                    </div>

                    <p className="shrink-0 text-base font-bold text-dc-ink">
                      {line}{" "}
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
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
            className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl"
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
              Customer & shipping
            </h2>

            <div className="mt-6 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                  Name
                </p>
                <p className="mt-1.5 text-sm font-semibold text-dc-ink">
                  {shippingName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                  Email
                </p>
                <p className="mt-1.5 text-sm font-semibold text-dc-ink">
                  {order.customer_email ?? "—"}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-dc-sand/20 px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/50">
                Address
              </p>
              <p className="mt-3 text-sm leading-relaxed text-dc-ink/70">
                {shipping.line1 || "—"}
                {shipping.line2 ? `, ${shipping.line2}` : ""}
                <br />
                {shipping.city}, {shipping.state} {shipping.postal_code}
                <br />
                {shipping.country}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl"
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
              Summary
            </h2>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-dc-ink/60">
                Total
              </span>
              <span className="text-xl font-bold text-dc-ink">
                {total}{" "}
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                  {order.currency_code}
                </span>
              </span>
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-dc-ink/40">
              Taxes and shipping were calculated at checkout.
            </p>
          </motion.div>
        </section>
      </motion.div>
    </main>
  );
}
