import fs from "fs";
import path from "path";
import { SESv2Client, GetAccountCommand } from "@aws-sdk/client-sesv2";

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvFile();

  const region = process.env.AWS_REGION;
  const sender = process.env.SES_FROM_EMAIL ?? process.env.NOTIFICATION_FROM_EMAIL;

  if (!region) {
    throw new Error("AWS_REGION is missing.");
  }

  if (!sender) {
    throw new Error("SES_FROM_EMAIL or NOTIFICATION_FROM_EMAIL is missing.");
  }

  const client = new SESv2Client({ region });
  const account = await client.send(new GetAccountCommand({}));

  console.log(
    JSON.stringify(
      {
        region,
        sender,
        productionAccessEnabled: account.ProductionAccessEnabled ?? null,
        sendingEnabled: account.SendingEnabled ?? null,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error("SES check failed.");
  console.error(error);
  process.exitCode = 1;
});
