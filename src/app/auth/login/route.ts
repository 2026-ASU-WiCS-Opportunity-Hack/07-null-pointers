import { NextResponse } from "next/server";

import { buildCognitoAuthorizeUrl } from "../../../lib/auth/oauth";
import { setAuthStateCookie } from "../../../lib/auth/session";

export async function GET() {
  const state = crypto.randomUUID();
  const response = NextResponse.redirect(buildCognitoAuthorizeUrl(state));

  setAuthStateCookie(response, state);

  return response;
}

