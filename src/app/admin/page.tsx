"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/isAdmin";

interface CurrentUser {
  id: string;
  email: string | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
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
          className="flex items-center gap-4 rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2.5 w-2.5 rounded-full bg-dc-caramel"
          />
          <p className="text-sm font-medium text-dc-ink/70">
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
            Admin
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl"
        >
          Admin dashboard
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 text-base leading-relaxed text-dc-ink/60"
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
          className="group rounded-3xl border border-dc-ink/8 bg-white/95 p-8 text-left shadow-sm backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
                Orders
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-dc-ink/70">
                Review and update customer orders.
              </p>
            </div>

            <motion.span
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-dc-ink/8 bg-gradient-to-br from-white to-dc-sand/30 text-lg text-dc-ink/70 shadow-sm transition-colors group-hover:border-dc-caramel/30 group-hover:text-dc-caramel"
            >
              →
            </motion.span>
          </div>

          <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-dc-sand/20 px-5 py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60">
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
          className="group rounded-3xl border border-dc-ink/8 bg-white/95 p-8 text-left shadow-sm backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
                Products
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-dc-ink/70">
                Manage catalog: visibility and pricing.
              </p>
            </div>

            <motion.span
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-dc-ink/8 bg-gradient-to-br from-white to-dc-sand/30 text-lg text-dc-ink/70 shadow-sm transition-colors group-hover:border-dc-caramel/30 group-hover:text-dc-caramel"
            >
              →
            </motion.span>
          </div>

          <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-dc-sand/20 px-5 py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60">
              Open products manager
            </p>
          </div>
        </motion.button>

        <motion.div className="rounded-3xl border border-dc-ink/8 bg-white/50 p-8 shadow-sm backdrop-blur-xl">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
            Coming soon
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-dc-ink/65">
            Collections, promos & more tools for Dani.
          </p>

          <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-dc-sand/20 px-5 py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60">
              In progress
            </p>
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}