import { Navigation } from "../../components/Navigation";
import { Chapters } from "../../components/Chapters";
import { Footer } from "../../components/Footer";
import { listGlobalChapterListings } from "../../lib/db/chapters";
import {
  getDefaultChapterHomepageContent,
  getPublishedManagedPageByChapterAndKey,
  parseChapterHomepageContent,
} from "../../lib/db/pages";

export default async function ChaptersPage() {
  const chapterListings = await listGlobalChapterListings();
  const chapters = await Promise.all(
    chapterListings.map(async (chapter) => {
      const homepage = chapter.hasPublishedSite
        ? await getPublishedManagedPageByChapterAndKey(chapter.id, "chapter_home")
        : null;
      const fallbackContent = getDefaultChapterHomepageContent({
        chapterName: chapter.name,
        country: chapter.country,
        contactEmail: chapter.contactEmail,
      });
      const homepageContent = parseChapterHomepageContent(
        homepage?.contentJson,
        fallbackContent,
      );

      return {
        id: chapter.id,
        name: chapter.name,
        slug: chapter.slug,
        country: chapter.country,
        summary: chapter.hasPublishedSite
          ? homepageContent.heroSubtitle
          : `This ${chapter.name} chapter has been created in the WIAL platform and is preparing its local website.`,
        coachCount: chapter.coachCount,
        hasPublishedSite: chapter.hasPublishedSite,
      };
    }),
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24">
        <Chapters chapters={chapters} />
      </main>
      <Footer />
    </div>
  );
}
