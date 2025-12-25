"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalCents } =
    useCartStore();
  const router = useRouter();

  const total = totalCents();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

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
            Cart
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl"
        >
          Your Cart
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 text-base leading-relaxed text-dc-ink/60"
        >
          Review your candles before you check out.
        </motion.p>
      </motion.header>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative mt-12 rounded-3xl border border-dc-ink/8 bg-white/95 p-10 shadow-lg backdrop-blur-xl"
        >
          <p className="text-base leading-relaxed text-dc-ink/60">
            Your cart is empty. Start by exploring our{" "}
            <Link
              href="/shop"
              className="font-bold text-dc-caramel transition-colors hover:text-dc-clay"
            >
              shop
            </Link>
            .
          </p>
        </motion.div>
      ) : (
        <div className="relative mt-12 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {items.map((item) => (
              <motion.div
                key={item.productId}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-start gap-5 rounded-3xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl"
              >
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-dc-ink/8 bg-gradient-to-br from-dc-cream/50 to-dc-sand/30">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/50">
                      Candle
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-display text-xl font-semibold leading-tight text-dc-ink transition-colors hover:text-dc-caramel"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-dc-ink/40">
                    {(item.priceCents / 100).toFixed(2)} {item.currencyCode}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-dc-ink/10 bg-white/80 shadow-sm">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 transition-colors hover:text-dc-caramel"
                      >
                        −
                      </motion.button>
                      <span className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink">
                        {item.quantity}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 transition-colors hover:text-dc-caramel"
                      >
                        +
                      </motion.button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/40 transition-colors hover:text-red-600"
                    >
                      Remove
                    </motion.button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-dc-ink">
                    {((item.priceCents * item.quantity) / 100).toFixed(2)}{" "}
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                      {item.currencyCode}
                    </span>
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={clearCart}
              className="inline-flex text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/40 transition-colors hover:text-red-600"
            >
              Clear cart
            </motion.button>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="h-fit rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl"
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
              Order summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between text-dc-ink/60">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold text-dc-ink">
                  {(total / 100).toFixed(2)}{" "}
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                    USD
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between text-dc-ink/50">
                <span className="font-medium">Shipping</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                  At checkout
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-dc-ink/8 pt-6">
              <div className="flex items-center justify-between">
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
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-dc-caramel px-6 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
            >
              Checkout
            </motion.button>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40">
              Taxes and shipping are calculated at checkout.
            </p>
          </motion.aside>
        </div>
      )}
    </main>
  );
}