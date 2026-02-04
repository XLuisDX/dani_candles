/* eslint-disable @next/next/no-img-element */
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
    <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20">
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
            Cart
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 font-display text-4xl font-semibold leading-tight text-dc-ink dark:text-white sm:mt-5 sm:text-5xl md:mt-6 md:text-6xl"
        >
          Your Cart
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-3 text-sm leading-relaxed text-dc-ink/60 dark:text-white/60 sm:mt-4 sm:text-base"
        >
          Review your candles before you check out.
        </motion.p>
      </motion.header>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative mt-8 rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:mt-10 sm:rounded-3xl sm:p-8 md:mt-12 md:p-10"
        >
          <p className="text-sm leading-relaxed text-dc-ink/60 dark:text-white/60 sm:text-base">
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
        <div className="relative mt-8 grid gap-6 sm:mt-10 md:mt-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-5"
          >
            {items.map((item) => (
              <motion.div
                key={item.productId}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex flex-col gap-4 rounded-2xl border border-dc-ink/8 bg-white/95 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:flex-row sm:items-start sm:gap-5 sm:rounded-3xl sm:p-6"
              >
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-dc-ink/8 bg-gradient-to-br from-dc-cream/50 to-dc-sand/30 dark:border-white/10 dark:from-white/5 dark:to-white/10 sm:rounded-2xl">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/50 dark:text-white/50 sm:text-[10px]">
                      Candle
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-display text-lg font-semibold leading-tight text-dc-ink transition-colors hover:text-dc-caramel dark:text-white sm:text-xl"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-dc-ink/40 dark:text-white/40 sm:mt-2 sm:text-[10px]">
                    {(item.priceCents / 100).toFixed(2)} {item.currencyCode}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5 sm:gap-3">
                    <div className="inline-flex items-center rounded-full border border-dc-ink/10 bg-white/80 shadow-sm dark:border-white/10 dark:bg-white/5">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 transition-colors hover:text-dc-caramel dark:text-white/60 sm:px-5 sm:py-2.5 sm:text-[10px]"
                      >
                        −
                      </motion.button>
                      <span className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink dark:text-white sm:px-4 sm:py-2.5 sm:text-[10px]">
                        {item.quantity}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 transition-colors hover:text-dc-caramel dark:text-white/60 sm:px-5 sm:py-2.5 sm:text-[10px]"
                      >
                        +
                      </motion.button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/40 transition-colors hover:text-red-600 dark:text-white/40 sm:text-[10px]"
                    >
                      Remove
                    </motion.button>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-lg font-bold text-dc-ink dark:text-white sm:text-xl">
                    {((item.priceCents * item.quantity) / 100).toFixed(2)}{" "}
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40 sm:text-[10px]">
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
              className="inline-flex text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/40 transition-colors hover:text-red-600 dark:text-white/40 sm:text-[10px]"
            >
              Clear cart
            </motion.button>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="h-fit rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-8"
          >
            <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
              Order summary
            </h2>

            <div className="mt-5 space-y-3.5 text-sm sm:mt-6 sm:space-y-4">
              <div className="flex items-center justify-between text-dc-ink/60 dark:text-white/60">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold text-dc-ink dark:text-white">
                  {(total / 100).toFixed(2)}{" "}
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40 sm:text-[10px]">
                    USD
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between text-dc-ink/50 dark:text-white/50">
                <span className="font-medium">Shipping</span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] sm:text-[10px]">
                  At checkout
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-dc-ink/8 pt-5 dark:border-white/10 sm:mt-6 sm:pt-6">
              <div className="flex items-center justify-between">
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
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-dc-caramel px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 sm:mt-8 sm:h-12 sm:text-[10px]"
            >
              Checkout
            </motion.button>

            <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40 dark:text-white/40 sm:mt-4 sm:text-[10px]">
              Taxes and shipping are calculated at checkout.
            </p>
          </motion.aside>
        </div>
      )}
    </main>
  );
}
