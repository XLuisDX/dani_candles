"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  animated?: boolean;
}

const variantStyles = {
  default: "border border-dc-ink/8 bg-white/95 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95",
  elevated: "bg-white shadow-lg dark:bg-[#1a1a1a]",
  outlined: "border-2 border-dc-ink/10 bg-transparent dark:border-white/10",
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "default",
      padding = "md",
      hoverable = false,
      animated = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "rounded-2xl",
      variantStyles[variant],
      paddingStyles[padding],
      hoverable && "transition-all duration-200 hover:shadow-md hover:border-dc-ink/15",
      className
    );

    if (animated) {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={hoverable ? { y: -4, scale: 1.01 } : undefined}
          transition={{ duration: 0.3 }}
          className={baseStyles}
          {...(props as HTMLMotionProps<"div">)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={baseStyles} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Card subcomponents
export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "font-display text-xl font-semibold text-dc-ink dark:text-white",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-1 text-sm text-dc-ink/60 dark:text-white/60", className)}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-4 flex items-center gap-3", className)}>
      {children}
    </div>
  );
}
