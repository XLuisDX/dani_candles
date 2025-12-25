"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { UserInfo } from "@/types/types";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.push("/auth/login");
        return;
      }

      const u = data.user;
      setUser({
        id: u.id,
        email: u.email ?? undefined,
        fullName:
          (u.user_metadata?.full_name as string | undefined) ?? undefined,
      });

      setLoading(false);
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className="relative mx-auto max-w-5xl px-6 py-16 md:py-20 lg:px-8">
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
            Loading your account...
          </p>
        </motion.div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="relative mx-auto max-w-5xl px-6 py-16 md:py-20 lg:px-8">
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
        className="pointer-events-none absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-dc-caramel blur-3xl"
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
            Account
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl"
        >
          My account
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 text-base leading-relaxed text-dc-ink/60"
        >
          Welcome back{user.fullName ? `, ${user.fullName}` : ""}.
        </motion.p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative mt-12 grid gap-6 md:grid-cols-2"
      >
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-sm backdrop-blur-xl"
        >
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
            Account details
          </h2>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                Email
              </p>
              <p className="mt-1.5 text-base font-medium text-dc-ink">
                {user.email ?? "Not available"}
              </p>
            </div>

            {user.fullName && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                  Name
                </p>
                <p className="mt-1.5 text-base font-medium text-dc-ink">
                  {user.fullName}
                </p>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 rounded-2xl border border-dc-ink/8 bg-dc-sand/30 px-5 py-4"
          >
            <p className="text-xs leading-relaxed text-dc-ink/60">
              Tip: Keep your profile up to date for a smoother checkout.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-sm backdrop-blur-xl"
        >
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
            Orders & addresses
          </h2>

          <p className="mt-6 text-sm leading-relaxed text-dc-ink/60">
            View your recent orders and saved shipping details.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => router.push("/account/orders")}
              className="inline-flex items-center justify-center rounded-full bg-dc-caramel px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
            >
              View order history
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => router.push("/account/addresses")}
              className="inline-flex items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/30"
            >
              Manage addresses
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex items-center justify-between rounded-2xl border border-dc-ink/8 bg-dc-sand/30 px-5 py-4"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/50">
              Next: Saved addresses
            </p>
            <span className="text-xs font-medium text-dc-ink/40">
              Coming soon
            </span>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}