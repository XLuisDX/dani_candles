"use client";

import { Toaster, toast as sonnerToast } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      expand={false}
      richColors={false}
      gap={12}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group flex items-center gap-3 w-full max-w-[380px] rounded-2xl border border-dc-ink/10 bg-white/95 px-4 py-3.5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:px-5 sm:py-4",
          title:
            "text-sm font-semibold text-dc-ink dark:text-white leading-tight",
          description:
            "text-xs text-dc-ink/60 dark:text-white/60 leading-relaxed mt-0.5",
          actionButton:
            "inline-flex h-8 items-center justify-center rounded-full bg-dc-caramel px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay",
          cancelButton:
            "inline-flex h-8 items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/70 transition-all duration-200 hover:bg-white hover:text-dc-ink dark:border-white/10 dark:bg-white/5 dark:text-white/70",
          closeButton:
            "absolute right-2 top-2 rounded-full p-1 text-dc-ink/40 transition-colors hover:text-dc-ink dark:text-white/40 dark:hover:text-white",
          success:
            "!border-emerald-500/20 !bg-emerald-50/95 dark:!bg-emerald-950/30",
          error:
            "!border-red-500/20 !bg-red-50/95 dark:!bg-red-950/30",
          warning:
            "!border-amber-500/20 !bg-amber-50/95 dark:!bg-amber-950/30",
          info: "!border-dc-caramel/20 !bg-dc-sand/20 dark:!bg-dc-caramel/10",
        },
      }}
    />
  );
}

// Custom toast icons
const icons = {
  success: (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
      <svg
        className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  ),
  error: (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 dark:bg-red-500/20">
      <svg
        className="h-4 w-4 text-red-600 dark:text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  ),
  warning: (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 dark:bg-amber-500/20">
      <svg
        className="h-4 w-4 text-amber-600 dark:text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
  ),
  info: (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dc-caramel/10 dark:bg-dc-caramel/20">
      <svg
        className="h-4 w-4 text-dc-caramel dark:text-dc-sand"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  ),
  cart: (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dc-caramel/10 dark:bg-dc-caramel/20">
      <svg
        className="h-4 w-4 text-dc-caramel dark:text-dc-sand"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    </div>
  ),
};

// Custom toast functions
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast(message, {
      description,
      icon: icons.success,
      duration: 3000,
    });
  },

  error: (message: string, description?: string) => {
    sonnerToast(message, {
      description,
      icon: icons.error,
      duration: 5000,
    });
  },

  warning: (message: string, description?: string) => {
    sonnerToast(message, {
      description,
      icon: icons.warning,
      duration: 4000,
    });
  },

  info: (message: string, description?: string) => {
    sonnerToast(message, {
      description,
      icon: icons.info,
      duration: 3000,
    });
  },

  cart: (message: string, description?: string) => {
    sonnerToast(message, {
      description,
      icon: icons.cart,
      duration: 2500,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },

  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id);
  },
};
