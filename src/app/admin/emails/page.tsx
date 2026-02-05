"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/isAdmin";
import { toast } from "@/components/Toast";

export default function AdminEmailsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sending, setSending] = useState(false);

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
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

      setIsAdmin(admin);
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!to || !subject || !message) {
      toast.error("Missing fields", "Please fill in all fields");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ to, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      toast.success("Email sent successfully!");
      setTo("");
      setSubject("");
      setMessage("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send email";
      toast.error("Error", errorMessage);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <main className="relative mx-auto max-w-3xl px-6 py-16 md:py-20 lg:px-8">
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

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="relative mx-auto max-w-3xl px-6 py-16 md:py-20 lg:px-8">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ x: -4 }}
        type="button"
        onClick={() => router.push("/admin")}
        className="relative inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/55 transition-colors hover:text-dc-caramel dark:text-white/55"
      >
        <span aria-hidden>←</span> Back to admin
      </motion.button>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative mt-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60">
            Admin · Emails
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 font-display text-4xl font-semibold leading-tight text-dc-ink dark:text-white md:text-5xl"
        >
          Send email
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 text-base leading-relaxed text-dc-ink/60 dark:text-white/60"
        >
          Send a custom email to any customer.
        </motion.p>
      </motion.header>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        onSubmit={handleSubmit}
        className="relative mt-8 space-y-6"
      >
        <section className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#1a1a1a]/60 md:p-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.20em] text-dc-ink/55 dark:text-white/55">
            Recipient
          </p>

          <div className="mt-5">
            <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/60 dark:text-white/60">
              Email address
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              placeholder="customer@example.com"
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-dc-ink outline-none transition placeholder:text-dc-ink/40 focus:border-dc-caramel/35 focus:bg-white focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#1a1a1a]/60 md:p-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.20em] text-dc-ink/55 dark:text-white/55">
            Message
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/60 dark:text-white/60">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="Your order update from Dani Candles"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-dc-ink outline-none transition placeholder:text-dc-ink/40 focus:border-dc-caramel/35 focus:bg-white focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/60 dark:text-white/60">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={8}
                placeholder="Write your message here..."
                className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm leading-relaxed text-dc-ink outline-none transition placeholder:text-dc-ink/40 focus:border-dc-caramel/35 focus:bg-white focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10"
              />
              <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-dc-ink/45 dark:text-white/45">
                The message will be sent with Dani Candles branding.
              </p>
            </div>
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={sending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-dc-caramel px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.20em] text-white shadow-sm transition hover:bg-dc-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/40 disabled:opacity-50"
          >
            {sending ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                />
                Sending...
              </>
            ) : (
              "Send email"
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </main>
  );
}
