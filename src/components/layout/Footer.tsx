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
      <footer className="relative w-full border-t border-dc-ink/8 bg-white/95 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.25 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-40 w-2/3 rounded-full bg-dc-sand blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-dc-ink sm:text-base">
                Dani Candles
              </p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-dc-ink/60 sm:mt-3 sm:text-sm">
                Handcrafted candles to awaken your ambiance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-3 sm:gap-4"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/50 sm:text-[10px]">
                Legal
              </p>
              <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60 sm:gap-3 sm:text-[11px]">
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
              className="flex flex-col gap-3 sm:gap-4"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/50 sm:text-[10px]">
                Connect
              </p>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <motion.a
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dc-ink/8 bg-white/80 text-dc-ink/70 shadow-sm transition-all hover:border-dc-caramel/30 hover:bg-white hover:text-dc-caramel hover:shadow sm:h-11 sm:w-11"
                >
                  <FaInstagram className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </motion.a>
                <motion.a
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dc-ink/8 bg-white/80 text-dc-ink/70 shadow-sm transition-all hover:border-dc-caramel/30 hover:bg-white hover:text-dc-caramel hover:shadow sm:h-11 sm:w-11"
                >
                  <FaTiktok className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </motion.a>
                <motion.a
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dc-ink/8 bg-white/80 text-dc-ink/70 shadow-sm transition-all hover:border-dc-caramel/30 hover:bg-white hover:text-dc-caramel hover:shadow sm:h-11 sm:w-11"
                >
                  <FaFacebookF className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </motion.a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-col gap-3 border-t border-dc-ink/8 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-8 lg:mt-12"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 sm:text-[10px]">
              © {currentYear} Dani Candles. All rights reserved.
            </p>

            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-dc-ink/30 sm:text-[10px]">
              Made with care & intention
            </p>
          </motion.div>
        </div>
      </footer>

      <AnimatePresence>
        {activeModal && modalContent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
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
              className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-dc-ink/8 bg-white shadow-2xl sm:max-h-[80vh] sm:rounded-3xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-dc-ink/8 bg-white/95 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                <h2 className="font-display text-lg font-semibold text-dc-ink sm:text-xl lg:text-2xl">
                  {modalContent.title}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-dc-ink/8 bg-white text-dc-ink/70 transition-colors hover:border-dc-caramel/30 hover:text-dc-caramel sm:h-10 sm:w-10"
                  aria-label="Close modal"
                >
                  <IoClose className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-dc-ink/70 sm:text-sm">
                    {modalContent.content}
                  </pre>
                </div>
              </div>
              <div className="sticky bottom-0 border-t border-dc-ink/8 bg-white/95 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeModal}
                  className="w-full rounded-full bg-dc-caramel px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow sm:px-6 sm:py-3 sm:text-[10px]"
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