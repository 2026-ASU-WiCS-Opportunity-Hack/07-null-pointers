import { getSingleRow, queryDb } from "./client";

export type CoachDuePaymentStatus = "pending" | "paid" | "failed" | "canceled";
export type CoachDueDashboardStatus = CoachDuePaymentStatus | "not_paid";

interface CoachDuePaymentRow {
  id: string;
  coach_id: string;
  user_id: string;
  chapter_id: string;
  amount_cents: number | string;
  currency: string;
  description: string;
  status: CoachDuePaymentStatus;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_customer_email: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminCoachPaymentRow {
  coach_id: string;
  coach_name: string;
  chapter_name: string;
  chapter_slug: string;
  amount_cents: number | string | null;
  currency: string | null;
  status: CoachDuePaymentStatus | null;
  paid_at: string | null;
  created_at: string | null;
}

interface AdminCoachPaymentSummaryRow {
  total_revenue_cents: string;
  paid_coach_count: string;
  unpaid_coach_count: string;
  pending_coach_count: string;
}

export interface CoachDuePayment {
  id: string;
  coachId: string;
  userId: string;
  chapterId: string;
  amountCents: number;
  currency: string;
  description: string;
  status: CoachDuePaymentStatus;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeCustomerEmail: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoachDuePaymentInput {
  coachId: string;
  userId: string;
  chapterId: string;
  amountCents: number;
  currency?: string;
  description: string;
  status?: CoachDuePaymentStatus;
  stripeCheckoutSessionId?: string | null;
  stripeCustomerEmail?: string | null;
}

export interface AdminCoachPaymentSummary {
  totalRevenueCents: number;
  paidCoachCount: number;
  unpaidCoachCount: number;
  pendingCoachCount: number;
}

export interface AdminCoachPaymentRecord {
  coachId: string;
  coachName: string;
  chapterName: string;
  chapterSlug: string;
  amountCents: number | null;
  currency: string;
  status: CoachDueDashboardStatus;
  paidAt: string | null;
  createdAt: string | null;
}

function mapCoachDuePayment(row: CoachDuePaymentRow): CoachDuePayment {
  return {
    id: row.id,
    coachId: row.coach_id,
    userId: row.user_id,
    chapterId: row.chapter_id,
    amountCents: Number(row.amount_cents),
    currency: row.currency,
    description: row.description,
    status: row.status,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    stripeCustomerEmail: row.stripe_customer_email,
    paidAt: row.paid_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getCoachDueDashboardStatus(
  payment: Pick<CoachDuePayment, "status"> | null,
): CoachDueDashboardStatus {
  if (!payment) {
    return "not_paid";
  }

  return payment.status;
}

export async function createCoachDuePayment(input: CreateCoachDuePaymentInput) {
  const result = await queryDb<CoachDuePaymentRow>(
    `
      insert into coach_due_payments (
        coach_id,
        user_id,
        chapter_id,
        amount_cents,
        currency,
        description,
        status,
        stripe_checkout_session_id,
        stripe_customer_email
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning
        id,
        coach_id,
        user_id,
        chapter_id,
        amount_cents,
        currency,
        description,
        status,
        stripe_checkout_session_id,
        stripe_payment_intent_id,
        stripe_customer_email,
        paid_at,
        created_at,
        updated_at
    `,
    [
      input.coachId,
      input.userId,
      input.chapterId,
      input.amountCents,
      input.currency ?? "usd",
      input.description,
      input.status ?? "pending",
      input.stripeCheckoutSessionId ?? null,
      input.stripeCustomerEmail ?? null,
    ],
  );

  return mapCoachDuePayment(result.rows[0]);
}

export async function getLatestCoachDuePaymentByCoachId(coachId: string) {
  const result = await queryDb<CoachDuePaymentRow>(
    `
      select
        id,
        coach_id,
        user_id,
        chapter_id,
        amount_cents,
        currency,
        description,
        status,
        stripe_checkout_session_id,
        stripe_payment_intent_id,
        stripe_customer_email,
        paid_at,
        created_at,
        updated_at
      from coach_due_payments
      where coach_id = $1
      order by created_at desc
      limit 1
    `,
    [coachId],
  );

  const row = getSingleRow(result);
  return row ? mapCoachDuePayment(row) : null;
}

export async function getCoachDuePaymentBySessionId(sessionId: string) {
  const result = await queryDb<CoachDuePaymentRow>(
    `
      select
        id,
        coach_id,
        user_id,
        chapter_id,
        amount_cents,
        currency,
        description,
        status,
        stripe_checkout_session_id,
        stripe_payment_intent_id,
        stripe_customer_email,
        paid_at,
        created_at,
        updated_at
      from coach_due_payments
      where stripe_checkout_session_id = $1
      limit 1
    `,
    [sessionId],
  );

  const row = getSingleRow(result);
  return row ? mapCoachDuePayment(row) : null;
}

export async function markCoachDuePaymentPaidBySession(
  sessionId: string,
  input: {
    stripePaymentIntentId?: string | null;
    stripeCustomerEmail?: string | null;
    paidAt?: string | null;
  } = {},
) {
  const result = await queryDb<CoachDuePaymentRow>(
    `
      update coach_due_payments
      set
        status = 'paid',
        stripe_payment_intent_id = coalesce($2, stripe_payment_intent_id),
        stripe_customer_email = coalesce($3, stripe_customer_email),
        paid_at = coalesce($4::timestamptz, paid_at, now())
      where stripe_checkout_session_id = $1
      returning
        id,
        coach_id,
        user_id,
        chapter_id,
        amount_cents,
        currency,
        description,
        status,
        stripe_checkout_session_id,
        stripe_payment_intent_id,
        stripe_customer_email,
        paid_at,
        created_at,
        updated_at
    `,
    [sessionId, input.stripePaymentIntentId ?? null, input.stripeCustomerEmail ?? null, input.paidAt ?? null],
  );

  const row = getSingleRow(result);
  return row ? mapCoachDuePayment(row) : null;
}

export async function updateCoachDuePaymentStatusBySession(
  sessionId: string,
  status: Exclude<CoachDuePaymentStatus, "paid">,
) {
  const result = await queryDb<CoachDuePaymentRow>(
    `
      update coach_due_payments
      set status = $2
      where stripe_checkout_session_id = $1
      returning
        id,
        coach_id,
        user_id,
        chapter_id,
        amount_cents,
        currency,
        description,
        status,
        stripe_checkout_session_id,
        stripe_payment_intent_id,
        stripe_customer_email,
        paid_at,
        created_at,
        updated_at
    `,
    [sessionId, status],
  );

  const row = getSingleRow(result);
  return row ? mapCoachDuePayment(row) : null;
}

export async function getAdminCoachPaymentSummary(): Promise<AdminCoachPaymentSummary> {
  const result = await queryDb<AdminCoachPaymentSummaryRow>(
    `
      with latest_payment as (
        select
          p.*,
          row_number() over (
            partition by p.coach_id
            order by p.created_at desc
          ) as row_num
        from coach_due_payments p
      )
      select
        coalesce((
          select sum(amount_cents)
          from coach_due_payments
          where status = 'paid'
        ), 0)::text as total_revenue_cents,
        (
          select count(*)
          from coaches c
          left join latest_payment lp
            on lp.coach_id = c.id
           and lp.row_num = 1
          where c.user_id is not null
            and lp.status = 'paid'
        )::text as paid_coach_count,
        (
          select count(*)
          from coaches c
          left join latest_payment lp
            on lp.coach_id = c.id
           and lp.row_num = 1
          where c.user_id is not null
            and (
              lp.status is null
              or lp.status in ('failed', 'canceled')
            )
        )::text as unpaid_coach_count,
        (
          select count(*)
          from coaches c
          left join latest_payment lp
            on lp.coach_id = c.id
           and lp.row_num = 1
          where c.user_id is not null
            and lp.status = 'pending'
        )::text as pending_coach_count
    `,
  );

  const row = result.rows[0];

  return {
    totalRevenueCents: Number(row?.total_revenue_cents ?? 0),
    paidCoachCount: Number(row?.paid_coach_count ?? 0),
    unpaidCoachCount: Number(row?.unpaid_coach_count ?? 0),
    pendingCoachCount: Number(row?.pending_coach_count ?? 0),
  };
}

export async function listAdminCoachPaymentRecords(): Promise<AdminCoachPaymentRecord[]> {
  const result = await queryDb<AdminCoachPaymentRow>(
    `
      with latest_payment as (
        select
          p.*,
          row_number() over (
            partition by p.coach_id
            order by p.created_at desc
          ) as row_num
        from coach_due_payments p
      )
      select
        c.id as coach_id,
        c.name as coach_name,
        ch.name as chapter_name,
        ch.slug as chapter_slug,
        lp.amount_cents,
        lp.currency,
        lp.status,
        lp.paid_at,
        lp.created_at
      from coaches c
      inner join chapters ch on ch.id = c.chapter_id
      left join latest_payment lp
        on lp.coach_id = c.id
       and lp.row_num = 1
      where c.user_id is not null
      order by ch.name asc, c.name asc
    `,
  );

  return result.rows.map((row) => ({
    coachId: row.coach_id,
    coachName: row.coach_name,
    chapterName: row.chapter_name,
    chapterSlug: row.chapter_slug,
    amountCents: row.amount_cents === null ? null : Number(row.amount_cents),
    currency: row.currency ?? "usd",
    status: row.status ?? "not_paid",
    paidAt: row.paid_at,
    createdAt: row.created_at,
  }));
}
