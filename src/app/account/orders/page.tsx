"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AccountOrder } from "@/types/types";
import { formatStatus, statusColorClasses } from "@/types/utils";

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
    <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
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
          className="inline-flex items-center gap-2 rounded-full border border-dc-ink/8 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm sm:gap-2.5 sm:px-5 sm:py-2"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 sm:text-[10px]">
            Orders
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 font-display text-4xl font-semibold leading-tight text-dc-ink sm:mt-5 sm:text-5xl md:mt-6 md:text-6xl"
        >
          Order history
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-3 text-sm leading-relaxed text-dc-ink/60 sm:mt-4 sm:text-base"
        >
          Review your past Dani Candles orders.
        </motion.p>
      </motion.section>

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-10 flex items-center gap-3 rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm sm:mt-12 sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-5"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-dc-caramel sm:h-2.5 sm:w-2.5"
          />
          <p className="text-xs font-medium text-dc-ink/70 sm:text-sm">
            Loading your orders...
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mt-10 rounded-xl border border-red-500/20 bg-red-50/50 px-4 py-4 text-xs font-medium text-red-700 sm:mt-12 sm:rounded-2xl sm:px-6 sm:py-5 sm:text-sm"
        >
          {error}
        </motion.div>
      )}

      {!loading && !error && orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative mt-10 rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-sm backdrop-blur-xl sm:mt-12 sm:rounded-3xl sm:p-8 md:p-10"
        >
          <p className="text-sm text-dc-ink/60 sm:text-base">
            You haven&apos;t placed any orders yet.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => router.push("/shop")}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-dc-caramel px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 sm:mt-6 sm:px-6 sm:py-3 sm:text-[10px]"
          >
            Start shopping
          </motion.button>
        </motion.div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative mt-10 hidden overflow-hidden rounded-2xl border border-dc-ink/8 bg-white/95 shadow-lg backdrop-blur-xl sm:mt-12 md:block md:rounded-3xl"
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
                    onClick={() =>
                      router.push(`/order/confirmation/${order.id}`)
                    }
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative mt-8 space-y-4 md:hidden"
          >
            {orders.map((order) => {
              const dateLabel = order.placed_at
                ? new Date(order.placed_at).toLocaleDateString()
                : "—";
              const total = (order.total_cents / 100).toFixed(2);

              return (
                <motion.button
                  key={order.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => router.push(`/order/confirmation/${order.id}`)}
                  className="w-full rounded-2xl border border-dc-ink/8 bg-white/95 p-5 text-left shadow-sm backdrop-blur-xl transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/40">
                        Order ID
                      </p>
                      <p className="mt-1 font-mono text-xs font-medium text-dc-ink/70">
                        {order.id}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] ${statusColorClasses(
                        order.status
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/40">
                        Date
                      </p>
                      <p className="text-xs font-medium text-dc-ink/70">
                        {dateLabel}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-dc-ink/5 pt-3">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/40">
                        Total
                      </p>
                      <p className="text-base font-bold text-dc-ink">
                        {total}{" "}
                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                          {order.currency_code}
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </>
      )}
    </main>
  );
}