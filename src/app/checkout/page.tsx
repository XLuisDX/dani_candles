"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCartStore } from "@/store/cartStore";

interface ShippingForm {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, clearCart } = useCartStore();
  const [loadingUser, setLoadingUser] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          status: "pending",
          payment_status: "pending",
          payment_provider: "manual",
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

      clearCart();
      router.push(`/order/confirmation/${orderId}`);
    } catch (err: unknown) {
      let errorMessage = "Something went wrong during checkout.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-zinc-400">Checking your session...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm text-zinc-400">
          Your cart is empty.{" "}
          <button
            type="button"
            onClick={() => router.push("/shop")}
            className="text-amber-300 hover:text-amber-200"
          >
            Continue shopping
          </button>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Checkout
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Enter your shipping details to complete your order.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5"
        >
          <div>
            <label className="block text-xs uppercase tracking-wide text-zinc-400">
              Full name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={form.fullName}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-zinc-400">
              Address line 1
            </label>
            <input
              type="text"
              name="line1"
              required
              value={form.line1}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-zinc-400">
              Address line 2 (optional)
            </label>
            <input
              type="text"
              name="line2"
              value={form.line2}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wide text-zinc-400">
                City
              </label>
              <input
                type="text"
                name="city"
                required
                value={form.city}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-zinc-400">
                State
              </label>
              <input
                type="text"
                name="state"
                required
                value={form.state}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wide text-zinc-400">
                Postal code
              </label>
              <input
                type="text"
                name="postalCode"
                required
                value={form.postalCode}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-zinc-400">
                Country
              </label>
              <input
                type="text"
                name="country"
                required
                value={form.country}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-zinc-400">
              Phone (optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-full bg-zinc-100 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-amber-300 disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>

        <aside className="rounded-2xl border border-zinc-900 bg-zinc-950/80 p-5">
          <h2 className="text-sm font-semibold text-zinc-100">Order summary</h2>

          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-zinc-100">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Qty {item.quantity}
                  </p>
                </div>
                <div className="text-xs text-zinc-200">
                  {((item.priceCents * item.quantity) / 100).toFixed(2)}{" "}
                  <span className="text-[10px] text-zinc-500">
                    {item.currencyCode}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-zinc-800 pt-4 text-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>{(subtotal / 100).toFixed(2)} USD</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-zinc-500">
              <span>Shipping</span>
              <span>Calculated later</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-zinc-500">
              <span>Taxes</span>
              <span>—</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm font-semibold text-zinc-100">
              <span>Total</span>
              <span>{(total / 100).toFixed(2)} USD</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
