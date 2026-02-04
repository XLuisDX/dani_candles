/**
 * Input sanitization utilities for preventing XSS and other injection attacks.
 * Use these for any user-generated content that will be displayed.
 */

/**
 * Basic HTML entity encoding for server-side use.
 * Converts special characters to their HTML entity equivalents.
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return ''

  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  }

  return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char)
}

/**
 * Sanitize a string by removing or encoding potentially dangerous characters.
 * Use for general text fields like names, addresses, etc.
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') return ''

  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newline and tab
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Trim whitespace
    .trim()
}

/**
 * Sanitize an email address.
 * Returns empty string if invalid format.
 */
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') return ''

  const sanitized = sanitizeText(email).toLowerCase()

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(sanitized)) return ''

  return sanitized
}

/**
 * Sanitize a phone number - keep only digits and basic formatting.
 */
export function sanitizePhone(phone: string | null | undefined): string {
  if (!phone || typeof phone !== 'string') return ''

  // Keep only digits, spaces, parentheses, dashes, and plus
  return phone.replace(/[^\d\s()+-]/g, '').trim()
}

/**
 * Sanitize a slug - lowercase alphanumeric and hyphens only.
 */
export function sanitizeSlug(slug: string | null | undefined): string {
  if (!slug || typeof slug !== 'string') return ''

  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Sanitize a URL - validate and return only safe URLs.
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return ''

  const trimmed = url.trim()

  // Only allow http, https, and relative URLs
  if (
    !trimmed.startsWith('http://') &&
    !trimmed.startsWith('https://') &&
    !trimmed.startsWith('/')
  ) {
    return ''
  }

  // Block javascript: and data: URLs
  const lowerUrl = trimmed.toLowerCase()
  if (lowerUrl.includes('javascript:') || lowerUrl.includes('data:')) {
    return ''
  }

  return trimmed
}

/**
 * Sanitize an object's string values recursively.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj }

  for (const key in result) {
    const value = result[key]

    if (typeof value === 'string') {
      (result as Record<string, unknown>)[key] = sanitizeText(value)
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>
      )
    }
  }

  return result
}

/**
 * Sanitize shipping address fields.
 */
export interface ShippingAddressInput {
  full_name?: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}

export function sanitizeShippingAddress(
  address: ShippingAddressInput
): ShippingAddressInput {
  return {
    full_name: sanitizeText(address.full_name),
    line1: sanitizeText(address.line1),
    line2: sanitizeText(address.line2),
    city: sanitizeText(address.city),
    state: sanitizeText(address.state),
    postal_code: sanitizeText(address.postal_code)?.replace(/[^a-zA-Z0-9\s-]/g, ''),
    country: sanitizeText(address.country),
  }
}
