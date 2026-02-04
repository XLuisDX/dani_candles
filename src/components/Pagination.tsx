"use client";

import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // No mostrar paginación si solo hay 1 página
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar primera página
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Mostrar páginas alrededor de la actual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Siempre mostrar última página
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-12 flex items-center justify-center gap-2 sm:mt-14 md:mt-16"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
        whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-dc-ink/10 bg-white/90 text-dc-ink/60 shadow-sm backdrop-blur-sm transition-all hover:border-dc-caramel/30 hover:text-dc-caramel disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-dc-ink/10 disabled:hover:text-dc-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:border-dc-sand/30 dark:hover:text-dc-sand dark:disabled:hover:border-white/10 dark:disabled:hover:text-white/60 sm:h-10 sm:w-10 sm:rounded-xl"
        aria-label="Previous page"
      >
        <svg
          className="h-4 w-4 sm:h-5 sm:w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-2">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-xs text-dc-ink/40 dark:text-white/40 sm:h-10 sm:w-10 sm:text-sm"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <motion.button
              key={pageNumber}
              whileHover={{ scale: isActive ? 1 : 1.05 }}
              whileTap={{ scale: isActive ? 1 : 0.95 }}
              onClick={() => onPageChange(pageNumber)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold shadow-sm backdrop-blur-sm transition-all sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm ${
                isActive
                  ? "border-dc-caramel bg-dc-caramel text-white shadow-md"
                  : "border-dc-ink/10 bg-white/90 text-dc-ink/60 hover:border-dc-caramel/30 hover:text-dc-caramel dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:border-dc-sand/30 dark:hover:text-dc-sand"
              }`}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNumber}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
        whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-dc-ink/10 bg-white/90 text-dc-ink/60 shadow-sm backdrop-blur-sm transition-all hover:border-dc-caramel/30 hover:text-dc-caramel disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-dc-ink/10 disabled:hover:text-dc-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:border-dc-sand/30 dark:hover:text-dc-sand dark:disabled:hover:border-white/10 dark:disabled:hover:text-white/60 sm:h-10 sm:w-10 sm:rounded-xl"
        aria-label="Next page"
      >
        <svg
          className="h-4 w-4 sm:h-5 sm:w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.button>
    </motion.nav>
  );
}