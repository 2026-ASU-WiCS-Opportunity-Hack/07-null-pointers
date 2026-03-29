import type { CertificationLevel } from "../../types/domain";
import {
  buildCoachSearchDocument,
  coachMatchesExplicitLocationQuery,
  cosineSimilarity,
  matchesCoachKeyword,
  normalizeDirectoryQuery,
  queryMentionsExplicitLocation,
} from "../coach-search";
import type {
  CoachSearchEmbeddingRecord,
  CoachWithChapter,
} from "../db/coaches";
import {
  getPublishedCoachForDirectoryById,
  listCoachSearchEmbeddingsForCoaches,
  listPublishedCoachesForDirectory,
  upsertCoachSearchEmbedding,
} from "../db/coaches";

import { createEmbeddings, getEmbeddingModel } from "./embeddings";

export interface SemanticCoachSearchResult extends CoachWithChapter {
  similarityScore?: number;
}

export interface SemanticCoachSearchResponse {
  mode: "semantic" | "fallback";
  results: SemanticCoachSearchResult[];
}

type RankedSemanticCoachSearchResult = CoachWithChapter & {
  similarityScore: number;
};

function filterByCertification(
  coaches: CoachWithChapter[],
  certificationLevel?: CertificationLevel | "all" | null,
) {
  if (!certificationLevel || certificationLevel === "all") {
    return coaches;
  }

  return coaches.filter(
    (coach) => coach.certificationLevel === certificationLevel,
  );
}

async function ensureCoachEmbeddings(coaches: CoachWithChapter[]) {
  const existingEmbeddings = await listCoachSearchEmbeddingsForCoaches(
    coaches.map((coach) => coach.id),
  );
  const existingByCoachId = new Map(
    existingEmbeddings.map((embedding) => [embedding.coachId, embedding]),
  );
  const model = getEmbeddingModel();

  const staleOrMissingCoaches = coaches.filter((coach) => {
    const searchDocument = buildCoachSearchDocument(coach);
    const existing = existingByCoachId.get(coach.id);

    return (
      !existing ||
      existing.model !== model ||
      existing.searchDocument !== searchDocument
    );
  });

  if (staleOrMissingCoaches.length === 0) {
    return existingEmbeddings;
  }

  const searchDocuments = staleOrMissingCoaches.map(buildCoachSearchDocument);
  const generatedEmbeddings = await createEmbeddings(searchDocuments);
  const refreshedEmbeddings: CoachSearchEmbeddingRecord[] = [];

  for (let index = 0; index < staleOrMissingCoaches.length; index += 1) {
    const coach = staleOrMissingCoaches[index];
    const searchDocument = searchDocuments[index];
    const embedding = generatedEmbeddings[index];

    refreshedEmbeddings.push(
      await upsertCoachSearchEmbedding({
        coachId: coach.id,
        model,
        searchDocument,
        embedding,
      }),
    );
  }

  const mergedByCoachId = new Map<string, CoachSearchEmbeddingRecord>();

  for (const embedding of existingEmbeddings) {
    mergedByCoachId.set(embedding.coachId, embedding);
  }

  for (const embedding of refreshedEmbeddings) {
    mergedByCoachId.set(embedding.coachId, embedding);
  }

  return Array.from(mergedByCoachId.values());
}

export async function searchPublishedCoachesSemantically(input: {
  query: string;
  certificationLevel?: CertificationLevel | "all" | null;
  maxResults?: number;
}) {
  const normalizedQuery = normalizeDirectoryQuery(input.query);
  const maxResults = input.maxResults ?? 12;
  const coaches = filterByCertification(
    await listPublishedCoachesForDirectory(),
    input.certificationLevel,
  );
  const requiresLocationMatch = queryMentionsExplicitLocation(
    normalizedQuery,
    coaches,
  );
  const candidateCoaches = requiresLocationMatch
    ? coaches.filter((coach) =>
        coachMatchesExplicitLocationQuery(coach, normalizedQuery),
      )
    : coaches;

  if (!normalizedQuery) {
    return {
      mode: "fallback",
      results: coaches.slice(0, maxResults),
    } satisfies SemanticCoachSearchResponse;
  }

  try {
    const embeddings = await ensureCoachEmbeddings(candidateCoaches);
    const queryEmbedding = (await createEmbeddings([normalizedQuery]))[0];

    const rankedResults = candidateCoaches
      .map((coach) => {
        const embedding = embeddings.find(
          (candidate) => candidate.coachId === coach.id,
        );

        if (!embedding) {
          return null;
        }

        return {
          ...coach,
          similarityScore: cosineSimilarity(queryEmbedding, embedding.embedding),
        } satisfies RankedSemanticCoachSearchResult;
      })
      .filter(
        (result): result is RankedSemanticCoachSearchResult => Boolean(result),
      )
      .filter((coach) => coach.similarityScore > 0.15)
      .sort((left, right) => right.similarityScore - left.similarityScore)
      .slice(0, maxResults);

    if (rankedResults.length > 0) {
      return {
        mode: "semantic",
        results: rankedResults,
      } satisfies SemanticCoachSearchResponse;
    }
  } catch (error) {
    console.error("Semantic coach search failed. Falling back to keyword search.", error);
  }

  const fallbackResults = candidateCoaches
    .filter((coach) => matchesCoachKeyword(coach, normalizedQuery))
    .slice(0, maxResults);

  return {
    mode: "fallback",
    results: fallbackResults,
  } satisfies SemanticCoachSearchResponse;
}

export async function refreshCoachSemanticSearchEmbedding(coachId: string) {
  const coach = await getPublishedCoachForDirectoryById(coachId);

  if (!coach) {
    return null;
  }

  const model = getEmbeddingModel();
  const searchDocument = buildCoachSearchDocument(coach);
  const embedding = (await createEmbeddings([searchDocument]))[0];

  return upsertCoachSearchEmbedding({
    coachId: coach.id,
    model,
    searchDocument,
    embedding,
  });
}
