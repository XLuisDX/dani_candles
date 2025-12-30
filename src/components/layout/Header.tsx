"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/isAdmin";
import { Logo } from "@/components/Logo";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-dc-ink/5 bg-dc-cream/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Logo
            variant="black"
            height={48}
            width={200}
            animated={true}
            onClick={() => router.push("/")}
            className="cursor-pointer"
          />

          <div className="flex flex-col">
            <span className="font-display text-base font-semibold tracking-[0.25em] text-dc-ink">
              DANI CANDLES
            </span>
            <span className="text-[9px] font-light tracking-[0.15em] text-dc-ink/50">
              AWAKEN TO AMBIANCE
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {["shop", "collections", "fragrances", "candle-care", "contact"].map(
            (item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
              >
                <Link
                  href={`/${item}`}
                  className="relative text-xs font-medium tracking-[0.2em] text-dc-ink/60 transition-colors duration-200 hover:text-dc-caramel"
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
            )
          )}
        </nav>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-2.5"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/cart"
              className="rounded-full border border-dc-ink/8 bg-white/80 px-5 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow"
            >
              CART
            </Link>
          </motion.div>

          {isAdmin && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/admin"
                className="rounded-full border border-dc-caramel/20 bg-dc-sand/50 px-4 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-dc-clay shadow-sm transition-all duration-200 hover:border-dc-caramel/30 hover:bg-dc-sand/70"
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
            >
              {!isLoggedIn ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth/login"
                    className="rounded-full bg-dc-caramel px-5 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow"
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
                      className="rounded-full px-4 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-dc-ink/60 transition-colors duration-200 hover:text-dc-caramel"
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
                      className="rounded-full border border-dc-ink/8 bg-white/80 px-5 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow"
                    >
                      LOGOUT
                    </button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}