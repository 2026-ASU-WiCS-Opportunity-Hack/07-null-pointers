import { notFound } from "next/navigation";

import { ChapterNavigation } from "../../components/ChapterNavigation";
import { Footer } from "../../components/Footer";
import { getChapterBySlug } from "../../lib/db/chapters";

export default async function ChapterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ chapterSlug: string }>;
}) {
  const { chapterSlug } = await params;
  const chapter = await getChapterBySlug(chapterSlug);

  if (!chapter || chapter.status !== "active") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ChapterNavigation chapterSlug={chapter.slug} chapterName={chapter.name} />
      {children}
      <Footer />
    </div>
  );
}
