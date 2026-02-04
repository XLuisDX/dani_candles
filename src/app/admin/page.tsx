"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/isAdmin";
import { CurrentUser } from "@/types/types";

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

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/auth/login");
        return;
      }

      const email = data.user.email ?? null;
      const admin = isAdminEmail(email);

      if (!admin) {
        router.push("/");
        return;
      }

      setUser({ id: data.user.id, email });
      setIsAdmin(admin);
      setLoading(false);
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-8">
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
          <p className="text-sm font-medium text-dc-ink/70 dark:text-white/70">
            Checking admin access...
          </p>
        </motion.div>
      </main>
    );
  }

  if (!isAdmin || !user) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-8">
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
          className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60">
            Admin
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink dark:text-white md:text-6xl"
        >
          Admin dashboard
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 text-base leading-relaxed text-dc-ink/60 dark:text-white/60"
        >
          Welcome,{" "}
          <span className="font-semibold text-dc-caramel">{user.email}</span>.
          Manage Dani Candles from here.
        </motion.p>
      </motion.section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative mt-12 grid gap-6 md:grid-cols-3"
      >
        <motion.button
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          type="button"
          onClick={() => router.push("/admin/orders")}
          className="group rounded-3xl border border-dc-ink/8 bg-white/95 p-8 text-left shadow-sm backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 dark:border-white/10 dark:bg-[#1a1a1a]/95"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60">
                Orders
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-dc-ink/70 dark:text-white/70">
                Review and update customer orders.
              </p>
            </div>

            <motion.span
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-dc-ink/8 bg-gradient-to-br from-white to-dc-sand/30 text-lg text-dc-ink/70 shadow-sm transition-colors group-hover:border-dc-caramel/30 group-hover:text-dc-caramel dark:border-white/10 dark:from-white/10 dark:to-white/5 dark:text-white/70"
            >
              →
            </motion.span>
          </div>

          <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-dc-sand/20 px-5 py-3.5 dark:border-white/10 dark:bg-white/5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60">
              Open orders panel
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          type="button"
          onClick={() => router.push("/admin/products")}
          className="group rounded-3xl border border-dc-ink/8 bg-white/95 p-8 text-left shadow-sm backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 dark:border-white/10 dark:bg-[#1a1a1a]/95"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60">
                Products
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-dc-ink/70 dark:text-white/70">
                Manage catalog: visibility and pricing.
              </p>
            </div>

            <motion.span
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-dc-ink/8 bg-gradient-to-br from-white to-dc-sand/30 text-lg text-dc-ink/70 shadow-sm transition-colors group-hover:border-dc-caramel/30 group-hover:text-dc-caramel dark:border-white/10 dark:from-white/10 dark:to-white/5 dark:text-white/70"
            >
              →
            </motion.span>
          </div>

          <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-dc-sand/20 px-5 py-3.5 dark:border-white/10 dark:bg-white/5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60">
              Open products manager
            </p>
          </div>
        </motion.button>

        <motion.div className="rounded-3xl border border-dc-ink/8 bg-white/50 p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/50">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60">
            Coming soon
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-dc-ink/65 dark:text-white/65">
            Collections, promos & more tools for Dani.
          </p>

          <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-dc-sand/20 px-5 py-3.5 dark:border-white/10 dark:bg-white/5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60">
              In progress
            </p>
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}