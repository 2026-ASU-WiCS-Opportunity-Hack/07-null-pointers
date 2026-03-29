import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import {
  markCoachDuePaymentPaidBySession,
  updateCoachDuePaymentStatusBySession,
} from "../../../../lib/db/payments";
import {
  getStripeClient,
  getStripeWebhookSecret,
  isStripeConfigured,
} from "../../../../lib/payments/stripe";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  try {
    const payload = await request.text();
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      getStripeWebhookSecret(),
    );

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      await markCoachDuePaymentPaidBySession(session.id, {
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
        stripeCustomerEmail: session.customer_details?.email ?? null,
        paidAt: new Date().toISOString(),
      });
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await updateCoachDuePaymentStatusBySession(session.id, "canceled");
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await updateCoachDuePaymentStatusBySession(session.id, "failed");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook verification failed.", error);
    return NextResponse.json({ error: "Webhook verification failed." }, { status: 400 });
  }
}
