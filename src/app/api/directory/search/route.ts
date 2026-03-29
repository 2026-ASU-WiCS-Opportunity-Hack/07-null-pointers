import { NextRequest, NextResponse } from "next/server";

import { searchPublishedCoachesSemantically } from "../../../../lib/ai/coach-directory-semantic-search";
import { CERTIFICATION_LEVELS } from "../../../../types/domain";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const certification = request.nextUrl.searchParams.get("certification");
  const certificationLevel =
    certification && CERTIFICATION_LEVELS.includes(certification as (typeof CERTIFICATION_LEVELS)[number])
      ? (certification as (typeof CERTIFICATION_LEVELS)[number])
      : certification === "all"
        ? "all"
        : null;

  if (!query) {
    return NextResponse.json(
      {
        mode: "fallback",
        results: [],
      },
      { status: 200 },
    );
  }

  try {
    const response = await searchPublishedCoachesSemantically({
      query,
      certificationLevel,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Directory semantic search route failed.", error);

    return NextResponse.json(
      {
        mode: "fallback",
        results: [],
      },
      { status: 200 },
    );
  }
}
