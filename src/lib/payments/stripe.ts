import Stripe from "stripe";

declare global {
  var __wialStripeClient: Stripe | undefined;
}

function getStripeSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new Error("Missing required environment variable: STRIPE_SECRET_KEY");
  }

  return secretKey;
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function getStripeClient() {
  if (!global.__wialStripeClient) {
    global.__wialStripeClient = new Stripe(getStripeSecretKey());
  }

  return global.__wialStripeClient;
}

export function getStripeWebhookSecret() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!webhookSecret) {
    throw new Error("Missing required environment variable: STRIPE_WEBHOOK_SECRET");
  }

  return webhookSecret;
}

export function getCoachDuesAmountCents() {
  const rawValue = process.env.STRIPE_COACH_DUES_AMOUNT_CENTS?.trim();

  if (!rawValue) {
    return 5000;
  }

  const parsed = Number(rawValue);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(
      "STRIPE_COACH_DUES_AMOUNT_CENTS must be a positive integer amount in cents",
    );
  }

  return parsed;
}

export function formatCurrency(amountCents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
}
