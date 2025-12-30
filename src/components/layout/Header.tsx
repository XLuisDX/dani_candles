"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/isAdmin";
import { Logo } from "@/components/Logo";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error && data.session) {
        setIsLoggedIn(true);
        const email = data.session.user?.email ?? null;
        setIsAdmin(isAdminEmail(email));
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
      setCheckingSession(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        const email = session.user?.email ?? null;
        setIsAdmin(isAdminEmail(email));
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 right-0 top-0 z-50 border-b border-dc-ink/5 bg-dc-cream/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <Link href="/" className="group flex items-center gap-2 sm:gap-3">
            <Logo
              variant="black"
              height={40}
              width={160}
              animated={true}
              onClick={() => router.push("/")}
              className="cursor-pointer sm:h-12 sm:w-[200px]"
            />

            <div className="hidden flex-col sm:flex">
              <span className="font-display text-sm font-semibold tracking-[0.25em] text-dc-ink sm:text-base">
                DANI CANDLES
              </span>
              <span className="text-[8px] font-light tracking-[0.15em] text-dc-ink/50 sm:text-[9px]">
                AWAKEN TO AMBIANCE
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 lg:flex lg:gap-6 xl:gap-8">
            {[
              "shop",
              "collections",
              "fragrances",
              "candle-care",
              "contact",
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
              >
                <Link
                  href={`/${item}`}
                  className="relative text-[10px] font-medium tracking-[0.2em] text-dc-ink/60 transition-colors duration-200 hover:text-dc-caramel xl:text-xs"
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="inline-block"
                  >
                    {item === "candle-care" ? "CARE" : item.toUpperCase()}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-1.5 sm:gap-2.5"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/cart"
                className="rounded-full border border-dc-ink/8 bg-white/80 px-3 py-2 text-[9px] font-semibold tracking-[0.2em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow sm:px-5 sm:py-2.5 sm:text-[10px] mx-2"
              >
                CART
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-dc-ink/8 bg-white/80 px-3 py-2 text-[9px] font-semibold tracking-[0.2em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow sm:px-5 sm:py-2.5 sm:text-[10px] mx-2"
              >
                SHOP
              </Link>
            </motion.div>

            {isAdmin && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <Link
                  href="/admin"
                  className="rounded-full border border-dc-caramel/20 bg-dc-sand/50 px-3 py-2 text-[9px] font-semibold tracking-[0.2em] text-dc-clay shadow-sm transition-all duration-200 hover:border-dc-caramel/30 hover:bg-dc-sand/70 sm:px-4 sm:py-2.5 sm:text-[10px]"
                >
                  ADMIN
                </Link>
              </motion.div>
            )}

            {!checkingSession && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="hidden md:block"
              >
                {!isLoggedIn ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/auth/login"
                      className="rounded-full bg-dc-caramel px-4 py-2 text-[9px] font-semibold tracking-[0.2em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow sm:px-5 sm:py-2.5 sm:text-[10px]"
                    >
                      SIGN IN
                    </Link>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/account"
                        className="rounded-full px-3 py-2 text-[9px] font-semibold tracking-[0.2em] text-dc-ink/60 transition-colors duration-200 hover:text-dc-caramel sm:px-4 sm:py-2.5 sm:text-[10px]"
                      >
                        ACCOUNT
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={handleLogout}
                        className="rounded-full border border-dc-ink/8 bg-white/80 px-4 py-2 text-[9px] font-semibold tracking-[0.2em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow sm:px-5 sm:py-2.5 sm:text-[10px]"
                      >
                        LOGOUT
                      </button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col items-center justify-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-dc-ink/5 lg:hidden"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={
                  mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                }
                className="h-0.5 w-5 bg-dc-ink transition-all"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="h-0.5 w-5 bg-dc-ink transition-all"
              />
              <motion.span
                animate={
                  mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                }
                className="h-0.5 w-5 bg-dc-ink transition-all"
              />
            </button>
          </motion.div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 right-0 top-[73px] z-40 overflow-hidden border-b border-dc-ink/5 bg-dc-cream/95 backdrop-blur-xl sm:top-[81px] lg:hidden"
          >
            <nav className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
              {/* Navigation Links */}
              <div className="mb-6 flex flex-col gap-4">
                {[
                  "shop",
                  "collections",
                  "fragrances",
                  "candle-care",
                  "contact",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={`/${item}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm font-medium tracking-[0.2em] text-dc-ink/60 transition-colors duration-200 hover:text-dc-caramel"
                    >
                      {item === "candle-care" ? "CARE" : item.toUpperCase()}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {!checkingSession && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  className="flex flex-col gap-3 border-t border-dc-ink/5 pt-6"
                >
                  {!isLoggedIn ? (
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-full bg-dc-caramel px-6 py-3 text-center text-xs font-semibold tracking-[0.2em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay"
                    >
                      SIGN IN
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-full border border-dc-ink/8 bg-white/80 px-6 py-3 text-center text-xs font-semibold tracking-[0.2em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:bg-white hover:text-dc-ink"
                      >
                        ACCOUNT
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded-full border border-dc-caramel/20 bg-dc-sand/50 px-6 py-3 text-center text-xs font-semibold tracking-[0.2em] text-dc-clay shadow-sm transition-all duration-200 hover:border-dc-caramel/30 hover:bg-dc-sand/70 sm:hidden"
                        >
                          ADMIN
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="rounded-full border border-dc-ink/8 bg-white/80 px-6 py-3 text-xs font-semibold tracking-[0.2em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:bg-white hover:text-dc-ink"
                      >
                        LOGOUT
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}