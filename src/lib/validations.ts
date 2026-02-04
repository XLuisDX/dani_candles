import { z } from 'zod'

// ========================================
// Common Schemas
// ========================================

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email is too short')
  .max(254, 'Email is too long')
  .transform((val) => val.toLowerCase().trim())

export const phoneSchema = z
  .string()
  .regex(/^[+]?[\d\s()-]{10,20}$/, 'Invalid phone number')
  .optional()
  .or(z.literal(''))

export const slugSchema = z
  .string()
  .min(2, 'Slug is too short')
  .max(100, 'Slug is too long')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')

export const uuidSchema = z.string().uuid('Invalid ID format')

export const priceSchema = z
  .number()
  .int('Price must be a whole number (in cents)')
  .min(0, 'Price cannot be negative')
  .max(100000000, 'Price is too high')

export const currencyCodeSchema = z.enum(['USD', 'EUR', 'GBP', 'CAD'])

// ========================================
// Shipping Address Schema
// ========================================

export const shippingAddressSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name is too short')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  line1: z
    .string()
    .min(5, 'Address is too short')
    .max(200, 'Address is too long'),
  line2: z.string().max(200, 'Address line 2 is too long').optional().or(z.literal('')),
  city: z
    .string()
    .min(2, 'City is too short')
    .max(100, 'City is too long'),
  state: z
    .string()
    .min(2, 'State is too short')
    .max(100, 'State is too long'),
  postal_code: z
    .string()
    .min(3, 'Postal code is too short')
    .max(20, 'Postal code is too long')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid postal code format'),
  country: z
    .string()
    .min(2, 'Country is too short')
    .max(100, 'Country is too long'),
})

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>

// ========================================
// Product Schemas
// ========================================

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name is too short')
    .max(200, 'Product name is too long'),
  slug: slugSchema.optional(),
  short_description: z
    .string()
    .max(500, 'Short description is too long')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(5000, 'Description is too long')
    .optional()
    .or(z.literal('')),
  price_cents: priceSchema,
  currency_code: currencyCodeSchema.default('USD'),
  is_featured: z.boolean().default(false),
  active: z.boolean().default(true),
  collection_id: uuidSchema.optional().nullable(),
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>

// ========================================
// Order Schemas
// ========================================

export const orderStatusSchema = z.enum([
  'pending',
  'paid',
  'preparing',
  'shipped',
  'delivered',
  'canceled',
  'refunded',
])

export const paymentStatusSchema = z.enum(['pending', 'succeeded', 'failed'])

export const orderItemSchema = z.object({
  product_id: uuidSchema,
  product_name: z.string().min(1).max(200),
  quantity: z.number().int().min(1).max(100),
  unit_price_cents: priceSchema,
  variant_data: z.record(z.string(), z.unknown()).optional().nullable(),
})

export const createOrderSchema = z.object({
  customer_email: emailSchema,
  shipping_address: shippingAddressSchema,
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
})

export type OrderStatus = z.infer<typeof orderStatusSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>

// ========================================
// Cart Schemas
// ========================================

export const cartItemSchema = z.object({
  productId: uuidSchema,
  name: z.string().min(1).max(200),
  slug: slugSchema,
  priceCents: priceSchema,
  currencyCode: currencyCodeSchema,
  quantity: z.number().int().min(1).max(100),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export type CartItemInput = z.infer<typeof cartItemSchema>

// ========================================
// Contact Form Schema
// ========================================

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name is too short')
    .max(100, 'Name is too long'),
  email: emailSchema,
  subject: z
    .string()
    .min(3, 'Subject is too short')
    .max(200, 'Subject is too long'),
  message: z
    .string()
    .min(10, 'Message is too short')
    .max(5000, 'Message is too long'),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

// ========================================
// Auth Schemas
// ========================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z
  .object({
    email: emailSchema,
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

// ========================================
// API Response Schemas
// ========================================

export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  code: z.string().optional(),
})

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(9),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type PaginationInput = z.infer<typeof paginationSchema>

// ========================================
// Validation Helpers
// ========================================

/**
 * Safely parse and validate data with Zod schema.
 * Returns { success: true, data } or { success: false, error }.
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

/**
 * Format Zod errors into a user-friendly object.
 */
export function formatZodErrors(
  error: z.ZodError
): Record<string, string[]> {
  const formatted: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_root'
    if (!formatted[path]) {
      formatted[path] = []
    }
    formatted[path].push(issue.message)
  }

  return formatted
}
