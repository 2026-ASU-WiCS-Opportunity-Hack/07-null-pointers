import {
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AdminResetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

import { getCognitoConfig } from "./config";

let cognitoAdminClient: CognitoIdentityProviderClient | null = null;

function getCognitoAdminClient() {
  if (cognitoAdminClient) {
    return cognitoAdminClient;
  }

  const { region } = getCognitoConfig();

  cognitoAdminClient = new CognitoIdentityProviderClient({
    region,
  });

  return cognitoAdminClient;
}

function isNamedAwsError(error: unknown, name: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === name
  );
}

export interface ProvisionCognitoUserInput {
  email: string;
  fullName: string;
}

export interface ProvisionCognitoUserResult {
  status: "invited" | "reset_sent";
}

export async function provisionCognitoUser(
  input: ProvisionCognitoUserInput,
): Promise<ProvisionCognitoUserResult> {
  const client = getCognitoAdminClient();
  const { userPoolId } = getCognitoConfig();
  const username = input.email.trim().toLowerCase();
  const attributes = [
    { Name: "email", Value: username },
    { Name: "name", Value: input.fullName },
    { Name: "email_verified", Value: "true" },
  ];

  try {
    await client.send(
      new AdminGetUserCommand({
        UserPoolId: userPoolId,
        Username: username,
      }),
    );

    await client.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: userPoolId,
        Username: username,
        UserAttributes: attributes,
      }),
    );

    await client.send(
      new AdminResetUserPasswordCommand({
        UserPoolId: userPoolId,
        Username: username,
      }),
    );

    return {
      status: "reset_sent",
    };
  } catch (error) {
    if (!isNamedAwsError(error, "UserNotFoundException")) {
      throw error;
    }
  }

  await client.send(
    new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: username,
      DesiredDeliveryMediums: ["EMAIL"],
      UserAttributes: attributes,
    }),
  );

  return {
    status: "invited",
  };
}
