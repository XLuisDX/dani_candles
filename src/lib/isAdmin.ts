export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || ''
  const emails = raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  return emails.includes(email.toLowerCase())
}
