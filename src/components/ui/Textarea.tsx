"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, hint, fullWidth = true, className, id, ...props },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60"
          >
            {label}
            {props.required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-xl border border-dc-ink/10 bg-white/80 px-4 py-3 text-sm text-dc-ink placeholder-dc-ink/40 shadow-sm backdrop-blur-sm transition-all duration-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-white/40",
            "focus:border-dc-caramel/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dc-caramel/20 dark:focus:bg-white/10",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-y min-h-[120px]",
            error && "border-red-400 focus:border-red-400 focus:ring-red-200",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : hint
                ? `${textareaId}-hint`
                : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
            className="text-xs text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-xs text-dc-ink/50 dark:text-white/50">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
