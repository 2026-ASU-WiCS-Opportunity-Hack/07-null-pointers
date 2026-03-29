import type { CoachWithChapter } from "./db/coaches";

const LOCATION_ALIASES: Record<string, string[]> = {
  brazil: [
    "brazil",
    "brasil",
    "brazilian",
    "brasileiro",
    "brasileira",
    "sao paulo",
    "rio de janeiro",
  ],
  china: ["china", "chinese", "beijing", "shanghai"],
  nigeria: ["nigeria", "nigerian", "lagos", "abuja"],
  "united states": [
    "united states",
    "usa",
    "u.s.a",
    "us",
    "u.s",
    "america",
    "american",
    "washington",
    "chicago",
    "tempe",
  ],
};

export function normalizeDirectoryQuery(query: string) {
  return query
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function tokenizeSearchText(value: string) {
  return normalizeDirectoryQuery(value)
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
}

function getCoachLocationPhrases(coach: CoachWithChapter) {
  const phrases = [
    coach.chapterCountry ?? "",
    coach.chapterSlug,
    coach.chapterName,
    coach.location ?? "",
  ];
  const normalizedCountry = normalizeDirectoryQuery(coach.chapterCountry ?? "");
  const aliases = LOCATION_ALIASES[normalizedCountry] ?? [];

  return [...phrases, ...aliases]
    .map(normalizeDirectoryQuery)
    .filter(Boolean);
}

function getCoachLocationTokens(coach: CoachWithChapter) {
  return new Set(
    getCoachLocationPhrases(coach).flatMap((phrase) => tokenizeSearchText(phrase)),
  );
}

export function queryMentionsExplicitLocation(
  query: string,
  coaches: CoachWithChapter[],
) {
  const normalizedQuery = normalizeDirectoryQuery(query);
  const queryTokens = new Set(tokenizeSearchText(normalizedQuery));

  for (const coach of coaches) {
    for (const phrase of getCoachLocationPhrases(coach)) {
      if (phrase && normalizedQuery.includes(phrase)) {
        return true;
      }
    }

    for (const token of getCoachLocationTokens(coach)) {
      if (queryTokens.has(token)) {
        return true;
      }
    }
  }

  return false;
}

export function coachMatchesExplicitLocationQuery(
  coach: CoachWithChapter,
  query: string,
) {
  const normalizedQuery = normalizeDirectoryQuery(query);
  const queryTokens = new Set(tokenizeSearchText(normalizedQuery));

  for (const phrase of getCoachLocationPhrases(coach)) {
    if (phrase && normalizedQuery.includes(phrase)) {
      return true;
    }
  }

  for (const token of getCoachLocationTokens(coach)) {
    if (queryTokens.has(token)) {
      return true;
    }
  }

  return false;
}

export function matchesCoachKeyword(coach: CoachWithChapter, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    coach.name,
    coach.chapterName,
    coach.chapterSlug,
    coach.chapterCountry ?? "",
    coach.location ?? "",
    coach.bio ?? "",
    coach.contactEmail ?? "",
    coach.certificationLevel,
    ...coach.languages,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function buildCoachSearchDocument(coach: CoachWithChapter) {
  return [
    `Coach name: ${coach.name}`,
    `Certification level: ${coach.certificationLevel}`,
    `Languages: ${coach.languages.join(", ") || "Not specified"}`,
    `Location: ${coach.location ?? "Not specified"}`,
    `Chapter: ${coach.chapterName}`,
    `Country: ${coach.chapterCountry ?? "Not specified"}`,
    `Contact email: ${coach.contactEmail ?? "Not provided"}`,
    `Bio: ${coach.bio ?? "No biography provided."}`,
  ].join("\n");
}

export function cosineSimilarity(left: number[], right: number[]) {
  if (left.length === 0 || left.length !== right.length) {
    return 0;
  }

  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index += 1) {
    dotProduct += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}
