"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-dc-ink/15 bg-dc-ink/[0.02] px-6 py-12 text-center dark:border-white/15 dark:bg-white/[0.02]",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-dc-sand/30 text-dc-caramel dark:bg-dc-caramel/10">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-dc-ink dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-dc-ink/60 dark:text-white/60">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}

// Pre-built empty states for common scenarios
export function EmptyCart({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      }
      title="Your cart is empty"
      description="Looks like you haven't added any candles yet. Start shopping to fill it up!"
      action={action}
    />
  );
}

export function EmptyOrders({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      }
      title="No orders yet"
      description="You haven't placed any orders. Once you do, they'll appear here."
      action={action}
    />
  );
}

export function EmptyProducts({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      }
      title="No products found"
      description="There are no products matching your criteria. Try adjusting your filters."
      action={action}
    />
  );
}

export function EmptySearch({ query, action }: { query?: string; action?: ReactNode }) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title={query ? `No results for "${query}"` : "No results found"}
      description="We couldn't find what you're looking for. Try different keywords or browse our collections."
      action={action}
    />
  );
}
