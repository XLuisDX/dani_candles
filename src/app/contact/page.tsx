"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 lg:px-8">
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

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl md:p-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
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
            Contact
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl"
        >
          Get in touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 text-base leading-relaxed text-dc-ink/60"
        >
          We would love to hear from you. Send us a message and we will respond
          as soon as possible.
        </motion.p>
      </motion.header>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl md:p-10"
        >
          <div className="space-y-12">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
                  Your name
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2.5 h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
                  placeholder="Daniela Valverde"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
                  Email address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2.5 h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
                Subject
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="subject"
                required
                value={form.subject}
                onChange={handleChange}
                className="mt-2.5 h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
                placeholder="How can we help you?"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
                Message
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                rows={6}
                className="mt-2.5 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 py-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-emerald-500/20 bg-emerald-50/80 px-5 py-3.5 text-sm font-medium text-emerald-700"
              >
                Thank you! We will get back to you soon.
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-red-500/20 bg-red-50/80 px-5 py-3.5 text-sm font-medium text-red-700"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-dc-caramel px-6 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send message"}
            </motion.button>
          </div>
        </motion.form>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl"
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
              Contact Info
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-dc-ink/10 bg-dc-cream/50">
                  <FaEnvelope className="h-4 w-4 text-dc-caramel" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-dc-ink/40">
                    Email
                  </p>
                  <a
                    href="mailto:hello@danicandles.com"
                    className="mt-1 text-sm font-medium text-dc-ink transition-colors hover:text-dc-caramel"
                  >
                    hello@danicandles.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-dc-ink/10 bg-dc-cream/50">
                  <FaPhone className="h-4 w-4 text-dc-caramel" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-dc-ink/40">
                    Phone
                  </p>
                  <a
                    href="tel:+15551234567"
                    className="mt-1 text-sm font-medium text-dc-ink transition-colors hover:text-dc-caramel"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-dc-ink/10 bg-dc-cream/50">
                  <FaMapMarkerAlt className="h-4 w-4 text-dc-caramel" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-dc-ink/40">
                    Location
                  </p>
                  <p className="mt-1 text-sm font-medium text-dc-ink">
                    Nashville, TN
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl"
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
              Follow Us
            </h2>

            <div className="mt-6 flex gap-3">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-dc-ink/10 bg-dc-cream/50 text-dc-caramel transition-colors hover:border-dc-caramel/30 hover:bg-dc-caramel hover:text-white"
              >
                <FaInstagram className="h-5 w-5" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-dc-ink/10 bg-dc-cream/50 text-dc-caramel transition-colors hover:border-dc-caramel/30 hover:bg-dc-caramel hover:text-white"
              >
                <FaFacebookF className="h-5 w-5" />
              </motion.a>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-dc-ink/60">
              Stay updated with new collections, special offers, and
              behind-the-scenes content.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="rounded-3xl border border-dc-ink/8 bg-gradient-to-br from-dc-caramel to-dc-clay p-8 shadow-lg"
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">
              Business Hours
            </h2>

            <div className="mt-6 space-y-3 text-sm text-white/80">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-semibold text-white">9:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="font-semibold text-white">10:00 - 14:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-semibold text-white">Closed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}