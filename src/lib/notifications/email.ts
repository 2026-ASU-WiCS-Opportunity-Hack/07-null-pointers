import {
  SESv2Client,
  SendEmailCommand,
} from "@aws-sdk/client-sesv2";

let sesClient: SESv2Client | null = null;

function getEmailSender() {
  return process.env.SES_FROM_EMAIL ?? process.env.NOTIFICATION_FROM_EMAIL ?? null;
}

function getSesClient() {
  if (sesClient) {
    return sesClient;
  }

  const region = process.env.AWS_REGION;

  if (!region) {
    throw new Error("AWS_REGION is required for SES email notifications.");
  }

  sesClient = new SESv2Client({ region });
  return sesClient;
}

export function isEmailNotificationConfigured() {
  return Boolean(getEmailSender());
}

export async function sendEmailNotification(input: {
  toAddresses: string[];
  subject: string;
  htmlBody: string;
  textBody: string;
}) {
  const fromEmail = getEmailSender();

  if (!fromEmail) {
    throw new Error(
      "SES_FROM_EMAIL or NOTIFICATION_FROM_EMAIL is not configured.",
    );
  }

  if (input.toAddresses.length === 0) {
    return;
  }

  await getSesClient().send(
    new SendEmailCommand({
      FromEmailAddress: fromEmail,
      Destination: {
        ToAddresses: input.toAddresses,
      },
      Content: {
        Simple: {
          Subject: {
            Data: input.subject,
          },
          Body: {
            Html: {
              Data: input.htmlBody,
            },
            Text: {
              Data: input.textBody,
            },
          },
        },
      },
    }),
  );
}
