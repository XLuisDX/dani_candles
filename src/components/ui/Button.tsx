"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
  animated?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-dc-caramel text-white shadow-sm hover:bg-dc-clay focus-visible:ring-dc-caramel",
  secondary:
    "bg-dc-sand/50 text-dc-clay border border-dc-caramel/20 shadow-sm hover:bg-dc-sand/70 hover:border-dc-caramel/30 focus-visible:ring-dc-sand",
  outline:
    "border border-dc-ink/8 bg-white/80 text-dc-ink/70 shadow-sm hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink focus-visible:ring-dc-ink/20",
  ghost:
    "text-dc-ink/60 hover:text-dc-caramel hover:bg-dc-ink/5 focus-visible:ring-dc-ink/20",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[9px] tracking-[0.15em]",
  md: "px-4 py-2 sm:px-5 sm:py-2.5 text-[9px] sm:text-[10px] tracking-[0.2em]",
  lg: "px-6 py-3 text-xs tracking-[0.2em]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      fullWidth = false,
      animated = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const baseStyles = cn(
      "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && "w-full",
      className
    );

    const content = (
      <>
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </>
    );

    if (animated) {
      return (
        <motion.button
          ref={ref}
          whileHover={!isDisabled ? { scale: 1.05 } : undefined}
          whileTap={!isDisabled ? { scale: 0.95 } : undefined}
          className={baseStyles}
          disabled={isDisabled}
          {...(props as HTMLMotionProps<"button">)}
        >
          {content}
        </motion.button>
      );
    }

    return (
      <button ref={ref} className={baseStyles} disabled={isDisabled} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
