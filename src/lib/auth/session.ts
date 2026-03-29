import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AUTH_SESSION_COOKIE = "wial_session";
const AUTH_STATE_COOKIE = "wial_auth_state";

interface BaseCookieSession {
  sub: string;
  email: string | null;
  name: string | null;
  username: string | null;
  expiresAt: number;
}

export interface AuthSession extends BaseCookieSession {
  email: string;
}

export interface CognitoIdTokenClaims {
  sub: string;
  email?: string;
  name?: string;
  exp?: number;
  "cognito:username"?: string;
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

export function decodeJwtClaims<T>(token: string): T {
  const segments = token.split(".");

  if (segments.length < 2) {
    throw new Error("Invalid JWT token format");
  }

  return JSON.parse(decodeBase64Url(segments[1])) as T;
}

export function buildSessionFromIdToken(idToken: string): AuthSession {
  const claims = decodeJwtClaims<CognitoIdTokenClaims>(idToken);
  const fallbackEmail = `${claims.sub}@users.wial.local`;

  return {
    sub: claims.sub,
    email: claims.email ?? fallbackEmail,
    name: claims.name ?? null,
    username: claims["cognito:username"] ?? null,
    expiresAt: claims.exp ?? Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  };
}

function isSecureCookie() {
  return process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") ?? false;
}

export function setAuthSessionCookie(response: NextResponse, session: AuthSession) {
  response.cookies.set(AUTH_SESSION_COOKIE, encodeBase64Url(JSON.stringify(session)), {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    expires: new Date(session.expiresAt * 1000),
  });
}

export function clearAuthSessionCookie(response: NextResponse) {
  response.cookies.set(AUTH_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    expires: new Date(0),
  });
}

export function setAuthStateCookie(response: NextResponse, state: string) {
  response.cookies.set(AUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    maxAge: 60 * 10,
  });
}

export function clearAuthStateCookie(response: NextResponse) {
  response.cookies.set(AUTH_STATE_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    expires: new Date(0),
  });
}

export async function getAuthStateCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_STATE_COOKIE)?.value ?? null;
}

export async function getAuthSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(raw)) as BaseCookieSession;

    if (!parsed.sub || !parsed.expiresAt || parsed.expiresAt <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      sub: parsed.sub,
      email: parsed.email ?? `${parsed.sub}@users.wial.local`,
      name: parsed.name,
      username: parsed.username,
      expiresAt: parsed.expiresAt,
    } satisfies AuthSession;
  } catch {
    return null;
  }
}

