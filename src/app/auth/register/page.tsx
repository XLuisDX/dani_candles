"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/Toast";

function DecorativeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-1/2 top-20 h-[250px] w-[250px] -translate-x-1/2 rounded-full bg-gradient-to-br from-dc-sand/40 to-dc-cream/20 blur-3xl dark:from-dc-caramel/10 dark:to-transparent sm:h-[300px] sm:w-[300px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute left-1/4 top-[70%] h-[150px] w-[150px] -translate-x-1/2 rounded-full border border-dc-caramel/10 dark:border-dc-caramel/5 sm:h-[200px] sm:w-[200px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.2 }}
        className="absolute right-1/4 top-[50%] h-[200px] w-[200px] translate-x-1/2 rounded-full bg-gradient-to-tl from-dc-cream/30 to-transparent blur-3xl dark:from-dc-caramel/5 sm:h-[250px] sm:w-[250px]"
      />
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/shop`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      toast.error("Registration failed", signUpError.message);
    } else {
      toast.success("Account created!", "Check your email to confirm");
      router.push(`/auth/confirm-email?email=${encodeURIComponent(email)}`);
    }

    setLoading(false);
  };

  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-20 overflow-y-hidden">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-dc-ink/8 bg-white/90 px-4 py-1.5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:gap-2.5 sm:px-5 sm:py-2"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
            Dani Candles
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 font-display text-3xl font-semibold leading-tight text-dc-ink dark:text-white sm:mt-5 sm:text-4xl md:mt-6"
        >
          Create account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-2 text-xs leading-relaxed text-dc-ink/60 dark:text-white/60 sm:mt-3 sm:text-sm"
        >
          Join Dani Candles and keep track of your orders.
        </motion.p>
      </motion.header>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        onSubmit={handleSubmit}
        className="relative mt-5 w-full space-y-4 rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:mt-6 sm:space-y-5 sm:rounded-3xl sm:p-8"
      >
        <div className="space-y-2 sm:space-y-2.5">
          <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
            Full name
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:h-12 sm:rounded-2xl sm:px-5"
            placeholder="Daniela Valverde"
          />
        </div>

        <div className="space-y-2 sm:space-y-2.5">
          <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
            Email
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:h-12 sm:rounded-2xl sm:px-5"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2 sm:space-y-2.5">
          <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
            Password
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:h-12 sm:rounded-2xl sm:px-5"
            placeholder="Minimum 6 characters"
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
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-dc-caramel px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-6 sm:h-12 sm:text-[10px]"
        >
          {loading ? "Creating account..." : "Create account"}
        </motion.button>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="relative mt-5 text-center text-[10px] text-dc-ink/60 dark:text-white/60 sm:mt-6 sm:text-xs"
      >
        Already have an account?{" "}
        <a
          href="/auth/login"
          className="font-bold uppercase tracking-[0.2em] text-dc-caramel transition-colors hover:text-dc-clay"
        >
          Sign in
        </a>
      </motion.p>
    </main>
  );
}
