import { NextResponse } from "next/server";

import { buildCognitoLogoutUrl } from "../../../lib/auth/oauth";
import { clearAuthSessionCookie, clearAuthStateCookie } from "../../../lib/auth/session";

export async function GET(request: Request) {
  const homeUrl = new URL("/", request.url).toString();
  const response = NextResponse.redirect(buildCognitoLogoutUrl(homeUrl));

  clearAuthSessionCookie(response);
  clearAuthStateCookie(response);

  return response;
}
