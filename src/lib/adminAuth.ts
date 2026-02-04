import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminEmail } from './isAdmin'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export interface AdminAuthResult {
  authorized: boolean
  email?: string
  error?: NextResponse
}

/**
 * Verifies that the request is from an authenticated admin user.
 * Use this at the start of admin API routes.
 */
export async function verifyAdminAuth(req: NextRequest): Promise<AdminAuthResult> {
  // Get the authorization header
  const authHeader = req.headers.get('authorization')

  // Also check for Supabase session cookie
  const cookies = req.cookies
  let accessToken: string | undefined

  // Try to get token from Authorization header first
  if (authHeader?.startsWith('Bearer ')) {
    accessToken = authHeader.substring(7)
  }

  // Try to get from cookie if no header
  if (!accessToken) {
    accessToken = cookies.get('sb-access-token')?.value
  }

  // Try the Supabase auth cookie format
  if (!accessToken) {
    const supabaseAuthCookie = cookies.get(
      `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`
    )?.value

    if (supabaseAuthCookie) {
      try {
        const parsed = JSON.parse(supabaseAuthCookie)
        accessToken = parsed?.[0]?.access_token
      } catch {
        // Invalid cookie format
      }
    }
  }

  if (!accessToken) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'Unauthorized: No access token provided' },
        { status: 401 }
      ),
    }
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)

    if (error || !user) {
      return {
        authorized: false,
        error: NextResponse.json(
          { error: 'Unauthorized: Invalid or expired token' },
          { status: 401 }
        ),
      }
    }

    const email = user.email
    if (!isAdminEmail(email)) {
      return {
        authorized: false,
        error: NextResponse.json(
          { error: 'Forbidden: Admin access required' },
          { status: 403 }
        ),
      }
    }

    return {
      authorized: true,
      email: email ?? undefined,
    }
  } catch (err) {
    console.error('[adminAuth] Error verifying admin:', err)
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'Internal server error during authentication' },
        { status: 500 }
      ),
    }
  }
}
