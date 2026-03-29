import { notFound } from "next/navigation";

import { ChapterDirectoryExperience } from "../../../components/ChapterDirectoryExperience";
import { getChapterPublicContext } from "../../../lib/chapter-public";
import { listPublishedCoachesByChapter } from "../../../lib/db/coaches";

type PageParams = Promise<{ chapterSlug: string }>;

export default async function ChapterDirectoryPage({
  params,
}: {
  params: PageParams;
}) {
  const { chapterSlug } = await params;
  const context = await getChapterPublicContext(chapterSlug);

  if (!context) {
    notFound();
  }

  const { chapter } = context;
  const coaches = await listPublishedCoachesByChapter(chapter.id);

  return (
    <ChapterDirectoryExperience
      chapterName={chapter.name}
      chapterCountry={chapter.country}
      coaches={coaches}
    />
  );
}
