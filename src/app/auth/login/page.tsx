"use client";

import { FormEvent, useState, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/Toast";

// Componente separado que usa useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const redirectTo = searchParams.get("redirect") || "/shop";

  useEffect(() => {
    if (resetSuccess) {
      toast.success("Password reset successful", "You can now sign in with your new password");
    }
  }, [resetSuccess]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      toast.error("Sign in failed", error.message);
      setLoading(false);
    } else if (data.session) {
      toast.success("Welcome back!");
      // Wait a moment for cookies to be set, then redirect
      await new Promise((resolve) => setTimeout(resolve, 100));
      window.location.href = redirectTo;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6 sm:mb-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-dc-ink/8 bg-white/90 px-4 py-1.5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:gap-2.5 sm:px-5 sm:py-2"
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 font-display text-3xl font-semibold leading-tight text-dc-ink dark:text-white sm:mt-5 sm:text-4xl md:mt-6"
        >
          Sign in
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-2 text-xs leading-relaxed text-dc-ink/60 dark:text-white/60 sm:mt-3 sm:text-sm"
        >
          Welcome back to Dani Candles.
        </motion.p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-5"
      >
        {resetSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-emerald-500/20 bg-emerald-50/80 px-4 py-3 text-xs font-medium text-emerald-800 sm:rounded-2xl sm:px-5 sm:py-3.5 sm:text-sm"
          >
            Password reset successful! You can now sign in with your new
            password.
          </motion.div>
        )}

        <div>
          <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
            Email
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 py-3 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:mt-2.5 sm:rounded-2xl sm:px-5 sm:py-3.5"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between sm:mb-2.5">
            <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
              Password
            </label>
            <a
              href="/auth/forgot-password"
              className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-caramel transition-colors hover:text-dc-clay sm:text-[10px]"
            >
              Forgot?
            </a>
          </div>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 py-3 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:rounded-2xl sm:px-5 sm:py-3.5"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-red-500/20 bg-red-50/80 px-4 py-3 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400 sm:rounded-2xl sm:px-5 sm:py-3.5 sm:text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-dc-caramel px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-6 sm:py-4 sm:text-[10px]"
        >
          {loading ? "Signing in..." : "Sign in"}
        </motion.button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-6 border-t border-dc-ink/8 pt-5 dark:border-white/10 sm:mt-8 sm:pt-6"
      >
        <p className="text-center text-[10px] text-dc-ink/60 dark:text-white/60 sm:text-xs">
          New here?{" "}
          <a
            href="/auth/register"
            className="mx-2 font-bold uppercase tracking-[0.2em] text-dc-caramel transition-colors hover:text-dc-clay"
          >
            Create an account
          </a>
        </p>
      </motion.div>
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col items-center justify-center px-4 py-8 sm:px-6 md:py-12 overflow-y-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-8 md:p-10"
      >
        <Suspense
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-dc-sand/20 rounded w-1/3"></div>
              <div className="h-8 bg-dc-sand/20 rounded w-2/3"></div>
              <div className="h-4 bg-dc-sand/20 rounded w-full"></div>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </motion.div>
    </main>
  );
}