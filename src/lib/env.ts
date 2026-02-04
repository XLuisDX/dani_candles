import { z } from "zod";

/**
 * Environment variable validation schema
 * This ensures all required environment variables are present at build time
 */

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),

  // Stripe (optional in dev)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Admin emails
  NEXT_PUBLIC_ADMIN_EMAILS: z.string().optional(),

  // Site URL
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  // Web3Forms
  NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: z.string().optional(),
});

const serverEnvSchema = z.object({
  // Supabase service role
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Supabase service role key is required"),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Resend
  RESEND_API_KEY: z.string().optional(),
  ORDER_FROM_EMAIL: z.string().email().optional(),
  ORDER_NOTIFICATIONS_EMAIL: z.string().email().optional(),
});

export type ClientEnv = z.infer<typeof envSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validated client environment variables
 */
function getClientEnv(): ClientEnv {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_ADMIN_EMAILS: process.env.NEXT_PUBLIC_ADMIN_EMAILS,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
  });

  if (!parsed.success) {
    console.error(
      "Invalid client environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid client environment variables");
  }

  return parsed.data;
}

/**
 * Validated server environment variables
 */
function getServerEnv(): ServerEnv {
  // Only validate on server
  if (typeof window !== "undefined") {
    throw new Error("Server environment variables cannot be accessed on client");
  }

  const parsed = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ORDER_FROM_EMAIL: process.env.ORDER_FROM_EMAIL,
    ORDER_NOTIFICATIONS_EMAIL: process.env.ORDER_NOTIFICATIONS_EMAIL,
  });

  if (!parsed.success) {
    console.error(
      "Invalid server environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid server environment variables");
  }

  return parsed.data;
}

// Export validated env objects
export const clientEnv = getClientEnv();
export const serverEnv = typeof window === "undefined" ? getServerEnv() : null;

// Helper to check if we're in production
export const isProduction = process.env.NODE_ENV === "production";

// Helper to check if we're in development
export const isDevelopment = process.env.NODE_ENV === "development";

// Site URL with fallback
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://danicandles.com";
