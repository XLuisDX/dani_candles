"use client";

import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Componente interno que usa useSearchParams
function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.email_confirmed_at) {
        router.push("/shop");
      }
    };

    checkSession();
  }, [router]);

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-dc-sand to-dc-caramel sm:h-24 sm:w-24"
      >
        <svg
          className="h-10 w-10 text-white sm:h-12 sm:w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-dc-ink/8 bg-white/90 px-4 py-1.5 shadow-sm sm:gap-2.5 sm:px-5 sm:py-2">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 sm:text-[10px]">
            Dani Candles
          </span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-4 text-center font-display text-3xl font-semibold leading-tight text-dc-ink sm:text-4xl"
      >
        Check your email
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-8 text-center"
      >
        <p className="mb-4 text-sm leading-relaxed text-dc-ink/70 sm:text-base">
          We&apos;ve sent a confirmation email to:
        </p>
        {email && (
          <p className="mb-4 font-mono text-sm font-semibold text-dc-caramel sm:text-base">
            {email}
          </p>
        )}
        <p className="text-sm leading-relaxed text-dc-ink/70 sm:text-base">
          Click the{" "}
          <strong className="font-semibold text-dc-ink">
            Confirm Email Address
          </strong>{" "}
          button in the email to activate your account and start exploring our
          collection of handcrafted candles.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-8 rounded-xl border border-dc-ink/10 bg-dc-sand/20 p-4 sm:p-6"
      >
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-dc-ink/80 sm:text-sm">
          What to do next
        </h3>
        <ul className="space-y-2 text-sm text-dc-ink/70">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-dc-caramel">✓</span>
            <span>Check your inbox and spam folder</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-dc-caramel">✓</span>
            <span>Click the confirmation button in the email</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-dc-caramel">✓</span>
            <span>Start shopping for your favorite scents</span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="my-8 border-t border-dc-ink/10"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="text-center text-xs text-dc-ink/60 sm:text-sm"
      >
        <a
          href="https://www.danicandles.com/"
          className="font-bold uppercase tracking-[0.2em] text-dc-caramel transition-colors hover:text-dc-clay"
        >
          Return to Home
        </a>
      </motion.div>
    </>
  );
}

export default function ConfirmEmailPage() {
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-200px)] max-w-2xl flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-20">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full rounded-2xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl sm:rounded-3xl sm:p-12 md:p-16"
      >
        <Suspense
          fallback={
            <div className="animate-pulse space-y-6 text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-dc-sand/20 sm:h-24 sm:w-24"></div>
              <div className="mx-auto h-4 w-32 rounded bg-dc-sand/20"></div>
              <div className="mx-auto h-8 w-48 rounded bg-dc-sand/20"></div>
              <div className="space-y-2">
                <div className="mx-auto h-4 w-full rounded bg-dc-sand/20"></div>
                <div className="mx-auto h-4 w-3/4 rounded bg-dc-sand/20"></div>
              </div>
            </div>
          }
        >
          <ConfirmEmailContent />
        </Suspense>
      </motion.div>
    </main>
  );
}