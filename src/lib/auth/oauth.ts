import { getCognitoConfig, AUTH_ROUTES } from "./config";

const COGNITO_SCOPES = ["openid", "email"] as const;

export interface TokenExchangeResponse {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

export function getAuthCallbackUrl() {
  const { appUrl } = getCognitoConfig();
  return new URL(AUTH_ROUTES.callback, appUrl).toString();
}

export function buildCognitoAuthorizeUrl(state: string) {
  const { domain, appClientId } = getCognitoConfig();
  const url = new URL("/oauth2/authorize", domain);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", appClientId);
  url.searchParams.set("redirect_uri", getAuthCallbackUrl());
  url.searchParams.set("scope", COGNITO_SCOPES.join(" "));
  url.searchParams.set("state", state);

  return url.toString();
}

export function buildCognitoLogoutUrl(returnTo?: string) {
  const { domain, appClientId, appUrl } = getCognitoConfig();
  const url = new URL("/logout", domain);

  url.searchParams.set("client_id", appClientId);
  url.searchParams.set("logout_uri", returnTo ?? appUrl);

  return url.toString();
}

export async function exchangeAuthorizationCode(code: string) {
  const { domain, appClientId, appClientSecret } = getCognitoConfig();
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (appClientSecret) {
    headers.Authorization = `Basic ${Buffer.from(
      `${appClientId}:${appClientSecret}`,
    ).toString("base64")}`;
  }

  const response = await fetch(new URL("/oauth2/token", domain), {
    method: "POST",
    headers,
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: appClientId,
      code,
      redirect_uri: getAuthCallbackUrl(),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Cognito token exchange failed: ${response.status} ${body}`);
  }

  const payload = (await response.json()) as {
    access_token: string;
    id_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
  };

  return {
    accessToken: payload.access_token,
    idToken: payload.id_token,
    refreshToken: payload.refresh_token,
    expiresIn: payload.expires_in,
    tokenType: payload.token_type,
  } satisfies TokenExchangeResponse;
}
