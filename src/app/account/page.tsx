"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserInfo } from "@/types/types";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
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
      <main className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20 overflow-y-hidden">
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
    <main className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20">
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
          className="inline-flex items-center gap-2 rounded-full border border-dc-ink/8 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:gap-2.5 sm:px-5 sm:py-2"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
            Account
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 font-display text-4xl font-semibold leading-tight text-dc-ink dark:text-white sm:mt-5 sm:text-5xl md:mt-6 md:text-6xl"
        >
          My account
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-3 text-sm leading-relaxed text-dc-ink/60 dark:text-white/60 sm:mt-4 sm:text-base"
        >
          Welcome back{user.fullName ? `, ${user.fullName}` : ""}.
        </motion.p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative mt-10 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2"
      >
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-8"
        >
          <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
            Account details
          </h2>

          <div className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40 sm:text-xs">
                Email
              </p>
              <p className="mt-1 text-sm font-medium text-dc-ink dark:text-white sm:mt-1.5 sm:text-base">
                {user.email ?? "Not available"}
              </p>
            </div>

            {user.fullName && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40 sm:text-xs">
                  Name
                </p>
                <p className="mt-1 text-sm font-medium text-dc-ink dark:text-white sm:mt-1.5 sm:text-base">
                  {user.fullName}
                </p>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 rounded-xl border border-dc-ink/8 bg-dc-sand/30 px-4 py-3.5 dark:border-white/10 dark:bg-white/5 sm:mt-8 sm:rounded-2xl sm:px-5 sm:py-4"
          >
            <p className="text-xs leading-relaxed text-dc-ink/60 dark:text-white/60">
              Tip: Keep your profile up to date for a smoother checkout.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-8"
        >
          <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
            Orders & addresses
          </h2>

          <p className="mt-5 text-xs leading-relaxed text-dc-ink/60 dark:text-white/60 sm:mt-6 sm:text-sm">
            View your recent orders and saved shipping details.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => router.push("/account/orders")}
              className="inline-flex w-full items-center justify-center rounded-full bg-dc-caramel px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 sm:w-auto sm:px-6 sm:py-3 sm:text-[10px]"
            >
              View order history
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled
              onClick={() => router.push("/account/addresses")}
              className="inline-flex w-full items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/30 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white sm:w-auto sm:px-6 sm:py-3 sm:text-[10px]"
            >
              Manage addresses
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 flex flex-col gap-2 rounded-xl border border-dc-ink/8 bg-dc-sand/30 px-4 py-3.5 dark:border-white/10 dark:bg-white/5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:px-5 sm:py-4"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/50 dark:text-white/50 sm:text-[10px]">
              Next: Saved addresses
            </p>
            <span className="text-xs font-medium text-dc-ink/40 dark:text-white/40">
              Coming soon
            </span>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}