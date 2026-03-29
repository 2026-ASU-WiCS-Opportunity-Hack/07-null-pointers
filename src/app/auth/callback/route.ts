import { NextRequest, NextResponse } from "next/server";

import { listRoleAssignmentsForUser } from "../../../lib/db/user-roles";
import { upsertUser } from "../../../lib/db/users";
import { AUTH_ROUTES, getCognitoConfig } from "../../../lib/auth/config";
import { exchangeAuthorizationCode } from "../../../lib/auth/oauth";
import {
  buildSessionFromIdToken,
  clearAuthStateCookie,
  getAuthStateCookie,
  setAuthSessionCookie,
} from "../../../lib/auth/session";
import { DASHBOARD_HOME_BY_ROLE } from "../../../types/rbac";

function buildUrl(path: string) {
  const { appUrl } = getCognitoConfig();
  return new URL(path, appUrl);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cognitoError = request.nextUrl.searchParams.get("error");
  const cognitoErrorDescription =
    request.nextUrl.searchParams.get("error_description");
  const expectedState = await getAuthStateCookie();

  if (cognitoError) {
    const response = NextResponse.redirect(
      buildUrl(
        `${AUTH_ROUTES.signIn}?error=auth-failed&provider_error=${encodeURIComponent(
          cognitoError,
        )}&provider_error_description=${encodeURIComponent(
          cognitoErrorDescription ?? "",
        )}`,
      ),
    );
    clearAuthStateCookie(response);
    return response;
  }

  if (!code) {
    return NextResponse.redirect(buildUrl(`${AUTH_ROUTES.signIn}?error=missing-code`));
  }

  if (!state || !expectedState || state !== expectedState) {
    const response = NextResponse.redirect(
      buildUrl(`${AUTH_ROUTES.signIn}?error=state-mismatch`),
    );
    clearAuthStateCookie(response);
    return response;
  }

  try {
    const tokenResponse = await exchangeAuthorizationCode(code);
    const session = buildSessionFromIdToken(tokenResponse.idToken);

    const user = await upsertUser({
      fullName: session.name?.trim() || null,
      email: session.email,
      cognitoSub: session.sub,
      status: "active",
    });

    const roleAssignments = await listRoleAssignmentsForUser(user.id);
    const primaryRole = roleAssignments.find((assignment) => assignment.role === "global_admin")
      ?? roleAssignments.find((assignment) => assignment.role === "chapter_lead")
      ?? roleAssignments.find((assignment) => assignment.role === "content_creator")
      ?? roleAssignments.find((assignment) => assignment.role === "coach");

    if (!primaryRole) {
      const response = NextResponse.redirect(
        buildUrl(`${AUTH_ROUTES.signIn}?error=missing-role`),
      );
      setAuthSessionCookie(response, session);
      clearAuthStateCookie(response);
      return response;
    }

    const redirectPath =
      primaryRole.role === "public_user"
        ? "/"
        : DASHBOARD_HOME_BY_ROLE[primaryRole.role];

    const response = NextResponse.redirect(buildUrl(redirectPath));

    setAuthSessionCookie(response, session);
    clearAuthStateCookie(response);

    return response;
  } catch (error) {
    const description =
      error instanceof Error ? error.message : "Unknown authentication error";

    const response = NextResponse.redirect(
      buildUrl(`${AUTH_ROUTES.signIn}?error=auth-failed`),
    );

    response.headers.set("x-wial-auth-error", description);

    response.cookies.set(
      "wial_auth_error",
      encodeURIComponent(description),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") ?? false,
        path: "/",
        maxAge: 60,
      },
    );

    clearAuthStateCookie(response);
    return response;
  }
}
