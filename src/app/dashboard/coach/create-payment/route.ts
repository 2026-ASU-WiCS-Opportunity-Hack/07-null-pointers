import { NextRequest, NextResponse } from "next/server";

import { getCurrentAppUser } from "../../../../lib/auth/current-user";
import { getCoachByUserId } from "../../../../lib/db/coaches";
import { createCoachDuePayment } from "../../../../lib/db/payments";
import {
  formatCurrency,
  getCoachDuesAmountCents,
  getStripeClient,
  isStripeConfigured,
} from "../../../../lib/payments/stripe";

function redirectToCoach(request: NextRequest, params: Record<string, string>) {
  const url = new URL("/dashboard/coach", request.url);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const isAllowed = currentUser.roleAssignments.some(
    (assignment) => assignment.role === "coach",
  );

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const coachProfile = await getCoachByUserId(currentUser.user.id);

  if (!coachProfile) {
    return redirectToCoach(request, {
      error: "missing-profile",
    });
  }

  if (!isStripeConfigured()) {
    return redirectToCoach(request, {
      payment: "unavailable",
    });
  }

  try {
    const stripe = getStripeClient();
    const amountCents = getCoachDuesAmountCents();
    const appOrigin = new URL("/", request.url).toString().replace(/\/$/, "");
    const description = `WIAL coach dues for ${coachProfile.name}`;
    const successUrl = new URL("/dashboard/coach/payment-return", appOrigin);
    successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");

    const cancelUrl = new URL("/dashboard/coach", appOrigin);
    cancelUrl.searchParams.set("payment", "canceled");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: coachProfile.contactEmail ?? currentUser.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "WIAL Coach Dues",
              description,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      metadata: {
        coachId: coachProfile.id,
        userId: currentUser.user.id,
        chapterId: coachProfile.chapterId,
      },
      payment_intent_data: {
        metadata: {
          coachId: coachProfile.id,
          userId: currentUser.user.id,
          chapterId: coachProfile.chapterId,
        },
      },
    });

    await createCoachDuePayment({
      coachId: coachProfile.id,
      userId: currentUser.user.id,
      chapterId: coachProfile.chapterId,
      amountCents,
      currency: "usd",
      description: `${description} (${formatCurrency(amountCents)})`,
      status: "pending",
      stripeCheckoutSessionId: session.id,
      stripeCustomerEmail: coachProfile.contactEmail ?? currentUser.user.email,
    });

    if (!session.url) {
      return redirectToCoach(request, {
        payment: "failed",
      });
    }

    return NextResponse.redirect(session.url, {
      status: 303,
    });
  } catch (error) {
    console.error("Failed to create Stripe coach dues checkout session.", error);

    return redirectToCoach(request, {
      payment: "failed",
    });
  }
}
