"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AccountOrder } from "@/types/types";

export default function AccountOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        router.push("/auth/login");
        return;
      }

      const userId = userData.user.id;

      const { data, error } = await supabase
        .from("orders")
        .select("id, placed_at, status, total_cents, currency_code")
        .eq("user_id", userId)
        .order("placed_at", { ascending: false });

      if (error) {
        console.error(error);
        setError("Could not load your orders.");
      } else {
        setOrders(data as AccountOrder[]);
      }

      setLoading(false);
    };

    loadOrders();
  }, [router]);

  const formatStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "paid":
        return "Paid";
      case "shipped":
        return "Shipped";
      case "canceled":
        return "Canceled";
      case "refunded":
        return "Refunded";
      default:
        return status;
    }
  };

  const statusColorClasses = (status: string) => {
    switch (status) {
      case "paid":
        return "border-emerald-500/30 text-emerald-700 bg-emerald-500/10";
      case "shipped":
        return "border-sky-500/30 text-sky-700 bg-sky-500/10";
      case "canceled":
        return "border-red-500/30 text-red-700 bg-red-500/10";
      case "refunded":
        return "border-purple-500/30 text-purple-700 bg-purple-500/10";
      default:
        return "border-amber-500/30 text-amber-800 bg-amber-500/10";
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
    <main className="relative mx-auto max-w-6xl px-6 py-8 md:py-12 lg:px-8">
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

      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
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
            Orders
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl"
        >
          Order history
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 text-base leading-relaxed text-dc-ink/60"
        >
          Review your past Dani Candles orders.
        </motion.p>
      </motion.section>

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
            Loading your orders...
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

      {!loading && !error && orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative mt-12 rounded-3xl border border-dc-ink/8 bg-white/95 p-10 shadow-sm backdrop-blur-xl"
        >
          <p className="text-base text-dc-ink/60">
            You haven&apos;t placed any orders yet.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => router.push("/shop")}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-dc-caramel px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
          >
            Start shopping
          </motion.button>
        </motion.div>
      )}

      {!loading && !error && orders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-dc-ink/8 bg-white/95 shadow-lg backdrop-blur-xl"
        >
          <div className="grid grid-cols-[1.7fr_1fr_1fr_1fr] gap-4 border-b border-dc-ink/8 bg-dc-sand/10 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/50">
            <span>Order</span>
            <span>Date</span>
            <span>Status</span>
            <span className="text-right">Total</span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {orders.map((order) => {
              const dateLabel = order.placed_at
                ? new Date(order.placed_at).toLocaleDateString()
                : "—";
              const total = (order.total_cents / 100).toFixed(2);

              return (
                <motion.button
                  key={order.id}
                  whileHover={{
                    x: 4,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  type="button"
                  onClick={() => router.push(`/order/confirmation/${order.id}`)}
                  className="grid w-full grid-cols-[1.7fr_1fr_1fr_1fr] gap-4 border-b border-dc-ink/5 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dc-caramel/50"
                >
                  <span className="font-mono text-xs font-medium text-dc-ink/70">
                    {order.id}
                  </span>

                  <span className="text-xs font-medium text-dc-ink/55">
                    {dateLabel}
                  </span>

                  <span>
                    <span
                      className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] ${statusColorClasses(
                        order.status
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </span>

                  <span className="text-right text-base font-bold text-dc-ink">
                    {total}{" "}
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                      {order.currency_code}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
