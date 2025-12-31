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
    <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20 mt-0">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -top-16 right-8 h-40 w-40 rounded-full bg-dc-sand blur-3xl sm:right-12 sm:h-48 sm:w-48 md:right-16 md:h-56 md:w-56"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -bottom-16 left-8 h-48 w-48 rounded-full bg-dc-caramel blur-3xl sm:left-12 sm:h-56 sm:w-56 md:h-64 md:w-64"
      />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl sm:rounded-3xl sm:p-8 md:p-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
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
            Contact
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 font-display text-4xl font-semibold leading-tight text-dc-ink sm:mt-5 sm:text-5xl md:mt-6 md:text-6xl"
        >
          Get in touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-3 text-sm leading-relaxed text-dc-ink/60 sm:mt-4 sm:text-base"
        >
          We would love to hear from you. Send us a message and we will respond
          as soon as possible.
        </motion.p>
      </motion.header>

      <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:mt-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl sm:rounded-3xl sm:p-8 md:p-10"
        >
          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 sm:text-[10px]">
                  Your name
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 sm:mt-2.5 sm:h-12 sm:rounded-2xl sm:px-5"
                  placeholder="Daniela Valverde"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 sm:text-[10px]">
                  Email address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 sm:mt-2.5 sm:h-12 sm:rounded-2xl sm:px-5"
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 sm:text-[10px]">
                Subject
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="subject"
                required
                value={form.subject}
                onChange={handleChange}
                className="mt-2 h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 sm:mt-2.5 sm:h-12 sm:rounded-2xl sm:px-5"
                placeholder="How can we help you?"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 sm:text-[10px]">
                Message
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                rows={6}
                className="mt-2 w-full resize-none rounded-xl border border-dc-ink/10 bg-white/80 px-4 py-3.5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 sm:mt-2.5 sm:rounded-2xl sm:px-5 sm:py-4"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-emerald-500/20 bg-emerald-50/80 px-4 py-3 text-xs font-medium text-emerald-700 sm:rounded-2xl sm:px-5 sm:py-3.5 sm:text-sm"
              >
                Thank you! We will get back to you soon.
              </motion.div>
            )}

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
              disabled={submitting}
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full bg-dc-caramel px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:text-[10px]"
            >
              {submitting ? "Sending..." : "Send message"}
            </motion.button>
          </div>
        </motion.form>

        <div className="space-y-5 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl sm:rounded-3xl sm:p-8"
          >
            <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 sm:text-[10px]">
              Contact Info
            </h2>

            <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-dc-ink/10 bg-dc-cream/50 sm:h-10 sm:w-10">
                  <FaEnvelope className="h-3.5 w-3.5 text-dc-caramel sm:h-4 sm:w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-dc-ink/40 sm:text-[10px]">
                    Email
                  </p>
                  <a
                    href="mailto:hello@danicandles.com"
                    className="mt-1 text-xs font-medium text-dc-ink transition-colors hover:text-dc-caramel sm:text-sm"
                  >
                    hello@danicandles.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-dc-ink/10 bg-dc-cream/50 sm:h-10 sm:w-10">
                  <FaPhone className="h-3.5 w-3.5 text-dc-caramel sm:h-4 sm:w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-dc-ink/40 sm:text-[10px]">
                    Phone
                  </p>
                  <a
                    href="tel:+15551234567"
                    className="mt-1 text-xs font-medium text-dc-ink transition-colors hover:text-dc-caramel sm:text-sm"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-dc-ink/10 bg-dc-cream/50 sm:h-10 sm:w-10">
                  <FaMapMarkerAlt className="h-3.5 w-3.5 text-dc-caramel sm:h-4 sm:w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-dc-ink/40 sm:text-[10px]">
                    Location
                  </p>
                  <p className="mt-1 text-xs font-medium text-dc-ink sm:text-sm">
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
            className="rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl sm:rounded-3xl sm:p-8"
          >
            <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 sm:text-[10px]">
              Follow Us
            </h2>

            <div className="mt-5 flex gap-3 sm:mt-6">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-dc-ink/10 bg-dc-cream/50 text-dc-caramel transition-colors hover:border-dc-caramel/30 hover:bg-dc-caramel hover:text-white sm:h-12 sm:w-12"
              >
                <FaInstagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-dc-ink/10 bg-dc-cream/50 text-dc-caramel transition-colors hover:border-dc-caramel/30 hover:bg-dc-caramel hover:text-white sm:h-12 sm:w-12"
              >
                <FaFacebookF className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.a>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-dc-ink/60 sm:mt-6 sm:text-sm">
              Stay updated with new collections, special offers, and
              behind-the-scenes content.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="rounded-2xl border border-dc-ink/8 bg-gradient-to-br from-dc-caramel to-dc-clay p-6 shadow-lg sm:rounded-3xl sm:p-8"
          >
            <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/90 sm:text-[10px]">
              Business Hours
            </h2>

            <div className="mt-5 space-y-2.5 text-xs text-white/80 sm:mt-6 sm:space-y-3 sm:text-sm">
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