import Link from "next/link";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";
import { getUserDisplayName } from "../../lib/auth/display-name";
import { getCurrentAppUser } from "../../lib/auth/current-user";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getMessage(error: string | undefined) {
  switch (error) {
    case "state-mismatch":
      return "Your login session expired. Please try signing in again.";
    case "missing-code":
      return "Cognito did not return an authorization code. Please try again.";
    case "missing-role":
      return "Your account signed in successfully, but no application role is assigned yet.";
    case "auth-failed":
      return "We could not complete sign in right now. Please try again.";
    default:
      return null;
  }
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await connection();
  let currentUser = null;

  try {
    currentUser = await getCurrentAppUser();
  } catch (error) {
    console.error("Failed to resolve current app user on the sign-in page.", error);
  }

  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const providerError =
    typeof params.provider_error === "string" ? params.provider_error : undefined;
  const providerErrorDescription =
    typeof params.provider_error_description === "string"
      ? params.provider_error_description
      : undefined;
  const cookieStore = await cookies();
  const authErrorFromCookie = cookieStore.get("wial_auth_error")?.value;
  const message = getMessage(error);
  const currentUserDisplayName = currentUser
    ? getUserDisplayName(currentUser.user)
    : null;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-32 px-6 pb-24 bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="max-w-6xl mx-auto grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <p className="text-sm tracking-[0.22em] uppercase text-blue-600 font-medium mb-4">
              WIAL Access
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Sign in to the
              <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                WIAL Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mb-8">
              Access the chapter platform, coach profile tools, and global admin
              workflows through a single secure WIAL login.
            </p>

            {message ? (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900">
                <div>{message}</div>
                {providerError ? (
                  <div className="mt-2 text-sm text-amber-800">
                    Cognito response: {providerError}
                    {providerErrorDescription ? ` - ${providerErrorDescription}` : ""}
                  </div>
                ) : null}
                {!providerError && authErrorFromCookie ? (
                  <div className="mt-2 text-sm text-amber-800 break-words">
                    Server response: {decodeURIComponent(authErrorFromCookie)}
                  </div>
                ) : null}
              </div>
            ) : null}

            {currentUser?.dashboardPath ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-900">
                  You are already signed in as {currentUserDisplayName}. Use
                  your dashboard below or sign out to switch accounts.
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={currentUser.dashboardPath}
                    className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:-translate-y-0.5"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <form action="/auth/logout" method="get">
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-full border border-slate-300 px-8 py-4 font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                    >
                      Sign Out First
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:-translate-y-0.5"
              >
                Continue with WIAL Login
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              One Login, Role-Based Access
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              WIAL uses centralized sign-in through Cognito. After login, the
              app routes each user based on their assigned role and chapter
              access.
            </p>
            <div className="grid gap-4">
              <div className="rounded-2xl bg-[#f7f8fb] border border-slate-200 px-5 py-4">
                <p className="text-sm uppercase tracking-[0.18em] text-blue-600 mb-1">
                  Global Admin
                </p>
                <p className="text-slate-600">Global dashboard and platform controls</p>
              </div>
              <div className="rounded-2xl bg-[#f7f8fb] border border-slate-200 px-5 py-4">
                <p className="text-sm uppercase tracking-[0.18em] text-teal-600 mb-1">
                  Chapter Team
                </p>
                <p className="text-slate-600">Chapter content, events, and local coach management</p>
              </div>
              <div className="rounded-2xl bg-[#f7f8fb] border border-slate-200 px-5 py-4">
                <p className="text-sm uppercase tracking-[0.18em] text-orange-500 mb-1">
                  Coach
                </p>
                <p className="text-slate-600">Profile visibility, bio updates, and account access</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
