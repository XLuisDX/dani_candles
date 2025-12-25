"use client";

import { LEGAL_CONTENT } from "@/types/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaInstagram, FaTiktok, FaFacebookF } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const openModal = (type: string) => {
    setActiveModal(type);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = "unset";
  };

  const getModalContent = () => {
    if (activeModal === "privacy") return LEGAL_CONTENT.privacy;
    if (activeModal === "terms") return LEGAL_CONTENT.terms;
    if (activeModal === "shipping") return LEGAL_CONTENT.shipping;
    return null;
  };

  const modalContent = getModalContent();

  return (
    <>
      <footer className="relative border-t border-dc-ink/8 bg-white/95 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.25 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-40 w-2/3 rounded-full bg-dc-sand blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-display text-base font-semibold tracking-[0.3em] uppercase text-dc-ink">
                Dani Candles
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-dc-ink/60">
                Handcrafted candles to awaken your ambiance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/50">
                Legal
              </p>
              <div className="flex flex-col gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60">
                <motion.button
                  whileHover="hover"
                  onClick={() => openModal("privacy")}
                  className="inline-block text-left transition-colors hover:text-dc-caramel"
                >
                  Privacy Policy
                </motion.button>
                <motion.button
                  whileHover="hover"
                  onClick={() => openModal("terms")}
                  className="inline-block text-left transition-colors hover:text-dc-caramel"
                >
                  Terms & Conditions
                </motion.button>
                <motion.button
                  whileHover="hover"
                  onClick={() => openModal("shipping")}
                  className="inline-block text-left transition-colors hover:text-dc-caramel"
                >
                  Shipping & Returns
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/50">
                Connect
              </p>
              <div className="flex items-center gap-3">
                <motion.a
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-dc-ink/8 bg-white/80 text-dc-ink/70 shadow-sm transition-all hover:border-dc-caramel/30 hover:bg-white hover:text-dc-caramel hover:shadow"
                >
                  <FaInstagram size={18} />
                </motion.a>
                <motion.a
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-dc-ink/8 bg-white/80 text-dc-ink/70 shadow-sm transition-all hover:border-dc-caramel/30 hover:bg-white hover:text-dc-caramel hover:shadow"
                >
                  <FaTiktok size={16} />
                </motion.a>
                <motion.a
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-dc-ink/8 bg-white/80 text-dc-ink/70 shadow-sm transition-all hover:border-dc-caramel/30 hover:bg-white hover:text-dc-caramel hover:shadow"
                >
                  <FaFacebookF size={16} />
                </motion.a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-col gap-4 border-t border-dc-ink/8 pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
              © {currentYear} Dani Candles. All rights reserved.
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-dc-ink/30">
              Made with care & intention
            </p>
          </motion.div>
        </div>
      </footer>

      <AnimatePresence>
        {activeModal && modalContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeModal}
              className="absolute inset-0 bg-dc-ink/60 backdrop-blur-sm"
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl border border-dc-ink/8 bg-white shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-dc-ink/8 bg-white/95 px-8 py-6 backdrop-blur-xl">
                <h2 className="font-display text-2xl font-semibold text-dc-ink">
                  {modalContent.title}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dc-ink/8 bg-white text-dc-ink/70 transition-colors hover:border-dc-caramel/30 hover:text-dc-caramel"
                  aria-label="Close modal"
                >
                  <IoClose size={24} />
                </motion.button>
              </div>
              <div className="overflow-y-auto px-8 py-6 max-h-[calc(80vh-88px)]">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-dc-ink/70">
                    {modalContent.content}
                  </pre>
                </div>
              </div>
              <div className="sticky bottom-0 border-t border-dc-ink/8 bg-white/95 px-8 py-6 backdrop-blur-xl">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeModal}
                  className="w-full rounded-full bg-dc-caramel px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
