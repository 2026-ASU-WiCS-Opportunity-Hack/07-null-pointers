import { NextResponse } from "next/server";

import { buildCognitoAuthorizeUrl } from "../../../lib/auth/oauth";
import { setAuthStateCookie } from "../../../lib/auth/session";

export async function GET(request: Request) {
  const appUrl = new URL("/", request.url).toString();

  try {
    const state = crypto.randomUUID();
    const response = NextResponse.redirect(buildCognitoAuthorizeUrl(state, appUrl));

    setAuthStateCookie(response, state);

    return response;
  } catch (error) {
    const description =
      error instanceof Error ? error.message : "Unknown authentication error";
    const response = NextResponse.redirect(
      new URL("/signin?error=auth-failed", appUrl),
    );

    response.cookies.set("wial_auth_error", encodeURIComponent(description), {
      httpOnly: true,
      sameSite: "lax",
      secure: appUrl.startsWith("https://"),
      path: "/",
      maxAge: 60,
    });

    return response;
  }
}
