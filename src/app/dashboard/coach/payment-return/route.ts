import { NextRequest, NextResponse } from "next/server";

import {
  getCoachDuePaymentBySessionId,
  markCoachDuePaymentPaidBySession,
} from "../../../../lib/db/payments";
import { getStripeClient, isStripeConfigured } from "../../../../lib/payments/stripe";

function redirectToCoach(request: NextRequest, payment: string) {
  const url = new URL("/dashboard/coach", request.url);
  url.searchParams.set("payment", payment);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id")?.trim();

  if (!sessionId || !isStripeConfigured()) {
    return redirectToCoach(request, "failed");
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      await markCoachDuePaymentPaidBySession(session.id, {
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
        stripeCustomerEmail: session.customer_details?.email ?? null,
        paidAt: new Date().toISOString(),
      });

      return redirectToCoach(request, "success");
    }

    const existingPayment = await getCoachDuePaymentBySessionId(session.id);

    if (existingPayment?.status === "paid") {
      return redirectToCoach(request, "success");
    }

    return redirectToCoach(request, "pending");
  } catch (error) {
    console.error("Failed to confirm Stripe payment return.", error);
    return redirectToCoach(request, "failed");
  }
}
