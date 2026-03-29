import type { AppUser } from "../../types/domain";

function looksLikeUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}

export function getUserDisplayName(user: Pick<AppUser, "fullName" | "email" | "cognitoSub">) {
  const fullName = user.fullName.trim();

  if (fullName && !looksLikeUuid(fullName) && fullName !== user.cognitoSub) {
    return fullName;
  }

  return user.email;
}
