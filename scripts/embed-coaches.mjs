import fs from "fs";
import path from "path";
import { Client } from "pg";

const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";

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

function requireEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function buildCoachSearchDocument(coach) {
  return [
    `Coach name: ${coach.name}`,
    `Certification level: ${coach.certification_level}`,
    `Languages: ${coach.languages.join(", ") || "Not specified"}`,
    `Location: ${coach.location ?? "Not specified"}`,
    `Chapter: ${coach.chapter_name}`,
    `Country: ${coach.chapter_country ?? "Not specified"}`,
    `Contact email: ${coach.contact_email ?? "Not provided"}`,
    `Bio: ${coach.bio ?? "No biography provided."}`,
  ].join("\n");
}

async function createEmbeddings(inputs) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireEnv("OPENAI_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_EMBEDDING_MODEL?.trim() || DEFAULT_EMBEDDING_MODEL,
      input: inputs,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI embeddings request failed: ${response.status} ${body}`);
  }

  const payload = await response.json();

  return payload.data
    .sort((left, right) => left.index - right.index)
    .map((item) => item.embedding);
}

async function main() {
  loadEnvFile();

  const client = new Client({
    connectionString: requireEnv("DATABASE_URL"),
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const coachesResult = await client.query(`
      select
        coaches.id,
        coaches.name,
        coaches.certification_level,
        coaches.languages,
        coaches.location,
        coaches.contact_email,
        coaches.bio,
        chapters.name as chapter_name,
        chapters.country as chapter_country
      from coaches
      inner join chapters on chapters.id = coaches.chapter_id
      where coaches.is_published = true
        and coaches.approval_status = 'approved'
      order by chapters.name asc, coaches.name asc
    `);

    const coaches = coachesResult.rows;

    if (coaches.length === 0) {
      console.log("No approved published coaches found.");
      return;
    }

    const documents = coaches.map(buildCoachSearchDocument);
    const embeddings = await createEmbeddings(documents);
    const model = process.env.OPENAI_EMBEDDING_MODEL?.trim() || DEFAULT_EMBEDDING_MODEL;

    await client.query("begin");

    for (let index = 0; index < coaches.length; index += 1) {
      const coach = coaches[index];

      await client.query(
        `
          insert into coach_search_embeddings (
            coach_id,
            model,
            search_document,
            embedding_json,
            updated_at
          )
          values ($1, $2, $3, $4::jsonb, now())
          on conflict (coach_id)
          do update set
            model = excluded.model,
            search_document = excluded.search_document,
            embedding_json = excluded.embedding_json,
            updated_at = now()
        `,
        [
          coach.id,
          model,
          documents[index],
          JSON.stringify(embeddings[index]),
        ],
      );
    }

    await client.query("commit");
    console.log(`Embedded ${coaches.length} coach profiles.`);
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Failed to embed coach profiles.");
  console.error(error);
  process.exitCode = 1;
});
