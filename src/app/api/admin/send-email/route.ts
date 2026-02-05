import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { resend } from "@/lib/resend";
import { isAdminEmail } from "@/lib/isAdmin";

async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const email = user.email ?? null;
  if (!isAdminEmail(email)) {
    return null;
  }

  return user;
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { to, subject, message } = body as {
      to?: string;
      subject?: string;
      message?: string;
    };

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, message" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const fromEmail =
      process.env.ORDER_FROM_EMAIL || "Dani Candles <hello@danicandles.com>";

    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 600; color: #1a1a1a; margin: 0;">Dani Candles</h1>
          </div>
          <div style="background: #fafafa; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
            <div style="font-size: 16px; line-height: 1.6; color: #333; white-space: pre-wrap;">${message}</div>
          </div>
          <div style="text-align: center; padding-top: 24px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #888; margin: 0;">
              Dani Candles · Handcrafted with love
            </p>
          </div>
        </div>
      `,
      text: message,
    });

    if (emailError) {
      console.error("[Send email] Resend error:", emailError);
      return NextResponse.json(
        { ok: false, error: emailError.message || "Failed to send email" },
        { status: 500 }
      );
    }

    console.log("[Send email] Email sent successfully:", emailResult);
    return NextResponse.json({ ok: true, id: emailResult?.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Send email] Handler error:", message);
    return NextResponse.json(
      { error: "Handler error", message },
      { status: 500 }
    );
  }
}
