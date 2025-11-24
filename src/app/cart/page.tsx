"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalCents } =
    useCartStore();
  const router = useRouter();

  const total = totalCents();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Your Cart
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Review your candles before you check out.
      </p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6">
          <p className="text-sm text-zinc-400">
            Your cart is empty. Start by exploring our{" "}
            <Link href="/shop" className="text-amber-300 hover:text-amber-200">
              shop
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-start gap-4 rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-zinc-900 text-[11px] text-zinc-500">
                  Candle
                </div>

                <div className="flex-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-sm font-medium text-zinc-100 hover:text-amber-300"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-1 text-xs text-zinc-500">
                    {(item.priceCents / 100).toFixed(2)} {item.currencyCode}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <div className="flex items-center rounded-full border border-zinc-700">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="px-3 py-1 text-zinc-300 hover:text-amber-300"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-zinc-100">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="px-3 py-1 text-zinc-300 hover:text-amber-300"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-sm font-semibold text-zinc-100">
                  {((item.priceCents * item.quantity) / 100).toFixed(2)}{" "}
                  <span className="text-xs font-normal text-zinc-500">
                    {item.currencyCode}
                  </span>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-zinc-500 hover:text-red-400"
            >
              Clear cart
            </button>
          </div>

          <aside className="rounded-2xl border border-zinc-900 bg-zinc-950/80 p-5">
            <h2 className="text-sm font-semibold text-zinc-100">
              Order summary
            </h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>
                  {(total / 100).toFixed(2)}{" "}
                  <span className="text-xs text-zinc-500">USD</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="mt-4 border-t border-zinc-800 pt-4">
              <div className="flex items-center justify-between text-sm font-semibold text-zinc-100">
                <span>Total</span>
                <span>
                  {(total / 100).toFixed(2)}{" "}
                  <span className="text-xs font-normal text-zinc-400">USD</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-5 w-full rounded-full bg-zinc-100 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-amber-300"
            >
              Checkout
            </button>

            <p className="mt-2 text-[11px] text-zinc-500">
              Taxes and shipping are calculated at checkout.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
