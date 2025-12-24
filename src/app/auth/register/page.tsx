"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Account created. Please check your email to confirm.");
      setTimeout(() => router.push("/shop"), 2000);
    }

    setLoading(false);
  };

  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col items-center justify-center px-6 py-16 md:py-20">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-dc-sand blur-3xl"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-dc-caramel blur-3xl"
      />

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60">
            Dani Candles
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 font-display text-4xl font-semibold leading-tight text-dc-ink"
        >
          Create account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-3 text-sm leading-relaxed text-dc-ink/60"
        >
          Join Dani Candles and keep track of your orders.
        </motion.p>
      </motion.header>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        onSubmit={handleSubmit}
        className="relative mt-6 w-full space-y-5 rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl"
      >
        <div className="space-y-2.5">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
            Full name
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
            placeholder="Daniela Valverde"
          />
        </div>

        <div className="space-y-2.5">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
            Email
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2.5">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
            Password
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
            placeholder="Minimum 6 characters"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-red-500/20 bg-red-50/80 px-5 py-3.5 text-sm font-medium text-red-700"
          >
            {error}
          </motion.div>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-50/80 px-5 py-3.5 text-sm font-medium text-emerald-800"
          >
            {message}
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-dc-caramel px-6 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </motion.button>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="relative mt-6 text-center text-xs text-dc-ink/60"
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
