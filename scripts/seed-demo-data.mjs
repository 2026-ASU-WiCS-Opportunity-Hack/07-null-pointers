import fs from "fs";
import path from "path";
import { Client } from "pg";

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

loadEnvFile();

const chapters = [
  {
    name: "WIAL USA",
    slug: "usa",
    country: "United States",
    primaryLanguage: "en",
    contactEmail: "usa@wial.org",
    themeVariant: "north-america",
  },
  {
    name: "WIAL Nigeria",
    slug: "nigeria",
    country: "Nigeria",
    primaryLanguage: "en",
    contactEmail: "nigeria@wial.org",
    themeVariant: "west-africa",
  },
  {
    name: "WIAL Brazil",
    slug: "brazil",
    country: "Brazil",
    primaryLanguage: "pt",
    contactEmail: "brazil@wial.org",
    themeVariant: "latam",
  },
];

const coaches = [
  {
    chapterSlug: "usa",
    name: "Dr. Sarah Johnson",
    certificationLevel: "SALC",
    languages: ["English"],
    location: "Washington, DC, USA",
    bio: "Supports leadership teams with executive coaching, strategic facilitation, and organizational learning design.",
    contactEmail: "sarah.johnson@wial.org",
  },
  {
    chapterSlug: "usa",
    name: "Michael Reed",
    certificationLevel: "PALC",
    languages: ["English"],
    location: "Chicago, Illinois, USA",
    bio: "Focuses on action learning in healthcare, people leadership, and team transformation.",
    contactEmail: "michael.reed@wial.org",
  },
  {
    chapterSlug: "nigeria",
    name: "Amara Okafor",
    certificationLevel: "CALC",
    languages: ["English"],
    location: "Lagos, Nigeria",
    bio: "Helps fast-growing teams improve collaboration and find breakthrough solutions through facilitated action learning.",
    contactEmail: "amara.okafor@wial.org",
  },
  {
    chapterSlug: "nigeria",
    name: "Chinedu Balogun",
    certificationLevel: "SALC",
    languages: ["English"],
    location: "Abuja, Nigeria",
    bio: "Works with public-sector, government, and education leaders on leadership development, team alignment, and practical problem solving.",
    contactEmail: "chinedu.balogun@wial.org",
  },
  {
    chapterSlug: "brazil",
    name: "Carlos Silva",
    certificationLevel: "SALC",
    languages: ["Portuguese", "English"],
    location: "Sao Paulo, Brazil",
    bio: "Apoia lideres industriais e equipes de manufatura com dinamica de equipe, alinhamento de lideranca e cultura de aprendizagem.",
    contactEmail: "carlos.silva@wial.org",
  },
  {
    chapterSlug: "brazil",
    name: "Mariana Costa",
    certificationLevel: "PALC",
    languages: ["Portuguese", "English"],
    location: "Rio de Janeiro, Brazil",
    bio: "Leads action learning experiences for leadership teams and cross-functional groups navigating change.",
    contactEmail: "mariana.costa@wial.org",
  },
];

const events = [
  {
    chapterSlug: "usa",
    title: "WIAL USA Leadership Roundtable",
    description: "A regional session on action learning for leadership development.",
    startDate: "2026-04-18T16:00:00Z",
    endDate: "2026-04-18T18:00:00Z",
    location: "Virtual",
    isGlobalVisible: true,
  },
  {
    chapterSlug: "nigeria",
    title: "WIAL Nigeria Chapter Gathering",
    description: "An affiliate-focused event highlighting local coaching and chapter growth.",
    startDate: "2026-04-25T14:00:00Z",
    endDate: "2026-04-25T16:00:00Z",
    location: "Lagos, Nigeria",
    isGlobalVisible: true,
  },
  {
    chapterSlug: "brazil",
    title: "WIAL Brazil Action Learning Forum",
    description: "A practical forum for coaches and organizations exploring action learning outcomes.",
    startDate: "2026-05-02T17:00:00Z",
    endDate: "2026-05-02T19:00:00Z",
    location: "Sao Paulo, Brazil",
    isGlobalVisible: true,
  },
];

const pages = [
  {
    chapterSlug: "usa",
    pageKey: "chapter_home",
    locale: "en",
    title: "WIAL USA",
    contentJson: {
      hero: "Action Learning leadership across the United States.",
      summary: "WIAL USA connects leaders, coaches, and organizations through a strong chapter network.",
    },
  },
  {
    chapterSlug: "nigeria",
    pageKey: "chapter_home",
    locale: "en",
    title: "WIAL Nigeria",
    contentJson: {
      hero: "Action Learning leadership for Nigeria's growing professional communities.",
      summary: "WIAL Nigeria brings chapter-based learning, coaching, and events to leaders across the region.",
    },
  },
  {
    chapterSlug: "brazil",
    pageKey: "chapter_home",
    locale: "pt",
    title: "WIAL Brazil",
    contentJson: {
      hero: "Action Learning para lideranca e desempenho de equipes no Brasil.",
      summary: "WIAL Brazil conecta coaches, organizacoes e oportunidades de desenvolvimento em um capitulo local forte.",
    },
  },
];

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    await client.query("begin");

    const chapterIds = new Map();

    for (const chapter of chapters) {
      const result = await client.query(
        `
          insert into chapters (
            name,
            slug,
            country,
            primary_language,
            contact_email,
            theme_variant,
            status
          )
          values ($1, $2, $3, $4, $5, $6, 'active')
          on conflict (slug)
          do update set
            name = excluded.name,
            country = excluded.country,
            primary_language = excluded.primary_language,
            contact_email = excluded.contact_email,
            theme_variant = excluded.theme_variant,
            status = excluded.status
          returning id, slug
        `,
        [
          chapter.name,
          chapter.slug,
          chapter.country,
          chapter.primaryLanguage,
          chapter.contactEmail,
          chapter.themeVariant,
        ],
      );

      chapterIds.set(result.rows[0].slug, result.rows[0].id);
    }

    for (const coach of coaches) {
      const chapterId = chapterIds.get(coach.chapterSlug);

      const updatedCoach = await client.query(
        `
          update coaches
          set
            chapter_id = $1,
            name = $2,
            certification_level = $3,
            languages = $4,
            bio = $5,
            location = $6,
            is_published = true
          where contact_email = $7
          returning id
        `,
        [
          chapterId,
          coach.name,
          coach.certificationLevel,
          coach.languages,
          coach.bio,
          coach.location,
          coach.contactEmail,
        ],
      );

      if (updatedCoach.rowCount === 0) {
        await client.query(
          `
            insert into coaches (
              chapter_id,
              name,
              certification_level,
              languages,
              bio,
              location,
              contact_email,
              is_published
            )
            values ($1, $2, $3, $4, $5, $6, $7, true)
          `,
          [
            chapterId,
            coach.name,
            coach.certificationLevel,
            coach.languages,
            coach.bio,
            coach.location,
            coach.contactEmail,
          ],
        );
      }
    }

    for (const event of events) {
      const chapterId = chapterIds.get(event.chapterSlug);

      await client.query(
        `
          insert into events (
            chapter_id,
            title,
            description,
            start_date,
            end_date,
            location,
            is_global_visible
          )
          values ($1, $2, $3, $4, $5, $6, $7)
          on conflict do nothing
        `,
        [
          chapterId,
          event.title,
          event.description,
          event.startDate,
          event.endDate,
          event.location,
          event.isGlobalVisible,
        ],
      );
    }

    for (const page of pages) {
      const chapterId = chapterIds.get(page.chapterSlug);

      const updatedPage = await client.query(
        `
          update pages
          set
            title = $4,
            content_json = $5::jsonb,
            status = 'published'
          where chapter_id = $1
            and page_key = $2
            and locale = $3
          returning id
        `,
        [
          chapterId,
          page.pageKey,
          page.locale,
          page.title,
          JSON.stringify(page.contentJson),
        ],
      );

      if (updatedPage.rowCount === 0) {
        await client.query(
          `
            insert into pages (
              chapter_id,
              page_key,
              locale,
              title,
              content_json,
              status
            )
            values ($1, $2, $3, $4, $5::jsonb, 'published')
          `,
          [
            chapterId,
            page.pageKey,
            page.locale,
            page.title,
            JSON.stringify(page.contentJson),
          ],
        );
      }
    }

    await client.query(
      `
        update users
        set full_name = $2
        where lower(email) = lower($1)
      `,
      ["kmadumita54@gmail.com", "Madumita"],
    );

    await client.query("commit");

    console.log("Demo data seeded successfully.");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
