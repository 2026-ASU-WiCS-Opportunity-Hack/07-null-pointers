export interface CognitoConfig {
  appUrl: string;
  region: string;
  userPoolId: string;
  appClientId: string;
  appClientSecret: string | null;
  domain: string;
}

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getCognitoConfig(): CognitoConfig {
  return {
    appUrl: requireEnv("NEXT_PUBLIC_APP_URL"),
    region: requireEnv("AWS_REGION"),
    userPoolId: requireEnv("COGNITO_USER_POOL_ID"),
    appClientId: requireEnv("COGNITO_APP_CLIENT_ID"),
    appClientSecret: process.env.COGNITO_APP_CLIENT_SECRET ?? null,
    domain: requireEnv("COGNITO_DOMAIN"),
  };
}

export const AUTH_ROUTES = {
  signIn: "/signin",
  callback: "/auth/callback",
  logout: "/auth/logout",
} as const;
