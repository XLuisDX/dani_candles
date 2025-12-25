"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCartStore } from "@/store/cartStore";
import { ShippingForm } from "@/types/types";

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

      const { data: orderInsert, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          customer_email: userEmail,
          status: "pending",
          payment_status: "pending",
          payment_provider: "stripe",
          subtotal_cents: subtotal,
          shipping_cents: shippingCents,
          tax_cents: taxCents,
          total_cents: total,
          currency_code: "USD",
          shipping_address: shippingAddress,
        })
        .select("id")
        .single();

      if (orderError || !orderInsert) {
        console.error(orderError);
        throw new Error("Could not create order.");
      }

      const orderId = orderInsert.id;

      const orderItemsPayload = items.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        product_name: item.name,
        unit_price_cents: item.priceCents,
        quantity: item.quantity,
        total_cents: item.priceCents * item.quantity,
        variant_data: null,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsPayload);

      if (itemsError) {
        console.error(itemsError);
        throw new Error("Could not create order items.");
      }

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
      <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2.5 w-2.5 rounded-full bg-dc-caramel"
          />
          <p className="text-sm font-medium text-dc-ink/70">
            Checking your session...
          </p>
        </motion.div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-dc-ink/8 bg-white/95 p-10 shadow-lg backdrop-blur-xl"
        >
          <p className="text-base leading-relaxed text-dc-ink/60">
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
    <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-8">
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
            Checkout
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl"
        >
          Checkout
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 text-base leading-relaxed text-dc-ink/60"
        >
          Enter your shipping details to complete your order.
        </motion.p>
      </motion.header>

      <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl md:p-10"
        >
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/50">
              Shipping details
            </p>
            <p className="mt-3 text-sm text-dc-ink/60">
              Use an address where someone can receive the package.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
                Full name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className="mt-2.5 h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
                placeholder="Daniela Valverde"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
                Address line 1
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="line1"
                required
                value={form.line1}
                onChange={handleChange}
                className="mt-2.5 h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
                placeholder="123 Main St"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
                Address line 2 (optional)
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="line2"
                value={form.line2}
                onChange={handleChange}
                className="mt-2.5 h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
                placeholder="Apt, suite, etc."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
                  City
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  className="mt-2.5 h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
                  placeholder="Nashville"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
                  State
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="state"
                  required
                  value={form.state}
                  onChange={handleChange}
                  className="mt-2.5 h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
                  placeholder="TN"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
                  Postal code
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="postalCode"
                  required
                  value={form.postalCode}
                  onChange={handleChange}
                  className="mt-2.5 h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
                  placeholder="37055"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
                  Country
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="country"
                  required
                  value={form.country}
                  onChange={handleChange}
                  className="mt-2.5 h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
                  placeholder="US"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
                Phone (optional)
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2.5 h-12 w-full rounded-2xl border border-dc-ink/10 bg-white/80 px-5 text-sm text-dc-ink shadow-sm outline-none transition-all placeholder:text-dc-ink/40 focus:border-dc-caramel/50 focus:bg-white focus:shadow focus:ring-4 focus:ring-dc-caramel/10"
                placeholder="(555) 123-4567"
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-dc-caramel px-6 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Placing order..." : "Place order"}
            </motion.button>

            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40">
              You will be redirected to Stripe to complete payment.
            </p>
          </div>
        </motion.form>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="h-fit rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl md:sticky md:top-6"
        >
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
            Order summary
          </h2>

          <div className="mt-6 space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                className="flex items-start justify-between gap-4 rounded-2xl border border-dc-ink/8 bg-white/80 px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-dc-ink">
                    {item.name}
                  </p>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40">
                    Qty {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-dc-ink">
                    {((item.priceCents * item.quantity) / 100).toFixed(2)}{" "}
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                      {item.currencyCode}
                    </span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 border-t border-dc-ink/8 pt-6 text-sm">
            <div className="flex items-center justify-between text-dc-ink/60">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold text-dc-ink">
                {(subtotal / 100).toFixed(2)}{" "}
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                  USD
                </span>
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-dc-ink/50">
              <span className="font-medium">Shipping</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                Calculated later
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-dc-ink/50">
              <span className="font-medium">Taxes</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                —
              </span>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-dc-ink/8 pt-6">
              <span className="text-sm font-semibold text-dc-ink/60">
                Total
              </span>
              <span className="text-2xl font-bold text-dc-ink">
                {(total / 100).toFixed(2)}{" "}
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                  USD
                </span>
              </span>
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40">
              Taxes and shipping are finalized at checkout.
            </p>
          </div>
        </motion.aside>
      </div>
    </main>
  );
}