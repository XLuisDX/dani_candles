"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cartStore";
import { ShippingForm } from "@/types/types";

function DecorativeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-1/2 top-32 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-gradient-to-br from-dc-sand/40 to-dc-cream/20 blur-3xl dark:from-dc-caramel/10 dark:to-transparent sm:h-[400px] sm:w-[400px] md:top-40"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute left-1/4 top-[60%] h-[200px] w-[200px] -translate-x-1/2 rounded-full border border-dc-caramel/10 dark:border-dc-caramel/5 sm:h-[280px] sm:w-[280px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute right-1/3 top-[45%] h-2 w-2 rounded-full bg-dc-caramel/20 dark:bg-dc-caramel/10 sm:h-3 sm:w-3"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.2 }}
        className="absolute right-1/4 top-[70%] h-[250px] w-[250px] translate-x-1/2 rounded-full bg-gradient-to-tl from-dc-cream/30 to-transparent blur-3xl dark:from-dc-caramel/5 sm:h-[350px] sm:w-[350px]"
      />
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, clearCart } = useCartStore();
  const [loadingUser, setLoadingUser] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [form, setForm] = useState<ShippingForm>({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
  });

  const subtotal = totalCents();
  const shippingCents = 0;
  const taxCents = 0;
  const total = subtotal + shippingCents + taxCents;

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.push("/auth/login");
        return;
      }
      setUserId(data.session.user.id);
      setUserEmail(data.session.user.email ?? null);
      setLoadingUser(false);
    };

    checkSession();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const shippingAddress = {
        full_name: form.fullName,
        line1: form.line1,
        line2: form.line2 || null,
        city: form.city,
        state: form.state,
        postal_code: form.postalCode,
        country: form.country,
        phone: form.phone || null,
      };

      // Create order via API (uses service role key to bypass RLS)
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          shippingAddress,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            priceCents: item.priceCents,
            quantity: item.quantity,
          })),
          subtotalCents: subtotal,
          shippingCents: shippingCents,
          taxCents: taxCents,
          totalCents: total,
          currencyCode: "USD",
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("Order creation error:", errorData);
        throw new Error(errorData.error || "Could not create order.");
      }

      const { orderId } = await orderResponse.json();

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          currency: "USD",
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unit_amount_cents: item.priceCents,
          })),
        }),
      });

      if (!response.ok) {
        console.error("Checkout session error", await response.text());
        throw new Error("Unable to start Stripe checkout.");
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error("No checkout URL returned.");
      }

      clearCart();

      window.location.href = url;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong during checkout.";
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20 mt-0">
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
            Checking your session...
          </p>
        </motion.div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20 mt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-8 md:p-10"
        >
          <p className="text-sm leading-relaxed text-dc-ink/60 dark:text-white/60 sm:text-base">
            Your cart is empty.{" "}
            <button
              type="button"
              onClick={() => router.push("/shop")}
              className="font-bold text-dc-caramel transition-colors hover:text-dc-clay"
            >
              Continue shopping
            </button>
            .
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20 mt-0">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-8 md:p-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
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
            Checkout
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 font-display text-4xl font-semibold leading-tight text-dc-ink dark:text-white sm:mt-5 sm:text-5xl md:mt-6 md:text-6xl"
        >
          Checkout
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-3 text-sm leading-relaxed text-dc-ink/60 dark:text-white/60 sm:mt-4 sm:text-base"
        >
          Enter your shipping details to complete your order.
        </motion.p>
      </motion.header>

      <div className="mt-8 grid gap-6 sm:mt-10 md:mt-12 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-8">
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-8 md:p-10"
        >
          <div className="mb-6 sm:mb-8">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/50 dark:text-white/50 sm:text-[10px]">
              Shipping details
            </p>
            <p className="mt-2 text-xs text-dc-ink/60 dark:text-white/60 sm:mt-3 sm:text-sm">
              Use an address where someone can receive the package.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
                Full name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className="mt-2 h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:mt-2.5 sm:h-12 sm:rounded-2xl sm:px-5"
                placeholder="Daniela Valverde"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
                Address line 1
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="line1"
                required
                value={form.line1}
                onChange={handleChange}
                className="mt-2 h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:mt-2.5 sm:h-12 sm:rounded-2xl sm:px-5"
                placeholder="123 Main St"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
                Address line 2 (optional)
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="line2"
                value={form.line2}
                onChange={handleChange}
                className="mt-2 h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:mt-2.5 sm:h-12 sm:rounded-2xl sm:px-5"
                placeholder="Apt, suite, etc."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
                  City
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  className="mt-2 h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:mt-2.5 sm:h-12 sm:rounded-2xl sm:px-5"
                  placeholder="Dickson"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
                  State
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="state"
                  required
                  value={form.state}
                  onChange={handleChange}
                  className="mt-2 h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:mt-2.5 sm:h-12 sm:rounded-2xl sm:px-5"
                  placeholder="TN"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
                  Postal code
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="postalCode"
                  required
                  value={form.postalCode}
                  onChange={handleChange}
                  className="mt-2 h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:mt-2.5 sm:h-12 sm:rounded-2xl sm:px-5"
                  placeholder="37055"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
                  Country
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="country"
                  required
                  value={form.country}
                  onChange={handleChange}
                  className="mt-2 h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:mt-2.5 sm:h-12 sm:rounded-2xl sm:px-5"
                  placeholder="US"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
                Phone (optional)
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 h-11 w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-white/10 sm:mt-2.5 sm:h-12 sm:rounded-2xl sm:px-5"
                placeholder="(555) 123-4567"
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
              disabled={submitting}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-dc-caramel px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-6 sm:h-12 sm:text-[10px]"
            >
              {submitting ? "Placing order..." : "Place order"}
            </motion.button>

            <p className="text-center text-[9px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40 dark:text-white/40 sm:text-[10px]">
              You will be redirected to Stripe to complete payment.
            </p>
          </div>
        </motion.form>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="h-fit rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-8 md:sticky md:top-6"
        >
          <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
            Order summary
          </h2>

          <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                className="flex items-start justify-between gap-3 rounded-xl border border-dc-ink/8 bg-white/80 px-4 py-3.5 dark:border-white/10 dark:bg-white/5 sm:gap-4 sm:rounded-2xl sm:px-5 sm:py-4"
              >
                <div>
                  <p className="text-xs font-semibold text-dc-ink dark:text-white sm:text-sm">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40 dark:text-white/40 sm:mt-1.5 sm:text-[10px]">
                    Qty {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-dc-ink dark:text-white sm:text-base">
                    {((item.priceCents * item.quantity) / 100).toFixed(2)}{" "}
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40 sm:text-[10px]">
                      {item.currencyCode}
                    </span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 border-t border-dc-ink/8 pt-5 text-sm dark:border-white/10 sm:mt-6 sm:pt-6">
            <div className="flex items-center justify-between text-dc-ink/60 dark:text-white/60">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold text-dc-ink dark:text-white">
                {(subtotal / 100).toFixed(2)}{" "}
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40 sm:text-[10px]">
                  USD
                </span>
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-dc-ink/50 dark:text-white/50 sm:mt-3">
              <span className="font-medium">Shipping</span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] sm:text-[10px]">
                Calculated later
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-dc-ink/50 dark:text-white/50 sm:mt-3">
              <span className="font-medium">Taxes</span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] sm:text-[10px]">
                —
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-dc-ink/8 pt-5 dark:border-white/10 sm:mt-6 sm:pt-6">
              <span className="text-sm font-semibold text-dc-ink/60 dark:text-white/60">
                Total
              </span>
              <span className="text-xl font-bold text-dc-ink dark:text-white sm:text-2xl">
                {(total / 100).toFixed(2)}{" "}
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40 sm:text-[10px]">
                  USD
                </span>
              </span>
            </div>

            <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40 dark:text-white/40 sm:mt-4 sm:text-[10px]">
              Taxes and shipping are finalized at checkout.
            </p>
          </div>
        </motion.aside>
      </div>
    </main>
  );
}