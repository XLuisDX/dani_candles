import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

export async function GET(_req: NextRequest) {
  try {
    const to = process.env.RESEND_TEST_EMAIL || 'luisdladron@outlook.com'
    const from = process.env.ORDER_FROM_EMAIL

    console.log('Sending test email FROM:', from, 'TO:', to)

    const { data, error } = await resend.emails.send({
      from: from!,
      to,
      subject: "Test email from Dani Candles",
      text: "If you see this, Resend is working 🎉",
    });

    console.log('Resend test data:', data)
    console.log('Resend test error:', error)

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown error in resend-test'
    console.error('Resend test endpoint error:', message)
    return NextResponse.json({ ok: false, message }, { status: 500 })
  }
}
