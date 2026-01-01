"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      // Success! Redirect to login
      router.push("/auth/login?reset=success");
    }
  };

  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-20 overflow-y-hidden">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -top-20 right-6 h-48 w-48 rounded-full bg-dc-sand blur-3xl sm:right-10 sm:h-56 sm:w-56 md:h-64 md:w-64"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -bottom-20 left-6 h-56 w-56 rounded-full bg-dc-caramel blur-3xl sm:left-10 sm:h-64 sm:w-64 md:h-72 md:w-72"
      />

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl sm:rounded-3xl sm:p-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-dc-ink/8 bg-white/90 px-4 py-1.5 shadow-sm sm:gap-2.5 sm:px-5 sm:py-2"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 sm:text-[10px]">
            Dani Candles
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 font-display text-3xl font-semibold leading-tight text-dc-ink sm:mt-5 sm:text-4xl md:mt-6"
        >
          Create new password
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-2 text-xs leading-relaxed text-dc-ink/60 sm:mt-3 sm:text-sm"
        >
          Your new password must be different from previously used passwords.
        </motion.p>
      </motion.header>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        onSubmit={handleSubmit}
        className="relative mt-5 w-full space-y-4 rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl sm:mt-6 sm:space-y-5 sm:rounded-3xl sm:p-8"
      >
        <div className="space-y-2 sm:space-y-2.5">
          <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 sm:text-[10px]">
            New Password
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 sm:h-12 sm:rounded-2xl sm:px-5"
            placeholder="Minimum 6 characters"
          />
        </div>

        <div className="space-y-2 sm:space-y-2.5">
          <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 sm:text-[10px]">
            Confirm Password
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 sm:h-12 sm:rounded-2xl sm:px-5"
            placeholder="Re-enter new password"
          />
        </div>

        {/* Password Requirements */}
        <div className="rounded-xl border border-dc-ink/10 bg-dc-sand/20 p-4">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 sm:text-[10px]">
            Password Requirements
          </p>
          <ul className="space-y-1 text-xs text-dc-ink/70">
            <li className="flex items-center gap-2">
              <span className={password.length >= 6 ? "text-emerald-600" : "text-dc-ink/40"}>
                {password.length >= 6 ? "✓" : "○"}
              </span>
              <span>At least 6 characters</span>
            </li>
            <li className="flex items-center gap-2">
              <span className={password === confirmPassword && password.length > 0 ? "text-emerald-600" : "text-dc-ink/40"}>
                {password === confirmPassword && password.length > 0 ? "✓" : "○"}
              </span>
              <span>Passwords match</span>
            </li>
          </ul>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-red-500/20 bg-red-50/80 px-4 py-3 text-xs font-medium text-red-700 sm:rounded-2xl sm:px-5 sm:py-3.5 sm:text-sm"
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
          {loading ? "Updating..." : "Reset Password"}
        </motion.button>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="relative mt-5 text-center text-[10px] text-dc-ink/60 sm:mt-6 sm:text-xs"
      >
        Remember your password?{" "}
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