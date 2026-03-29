import { getChapterBySlug } from "./db/chapters";
import {
  getDefaultChapterAboutContent,
  getDefaultChapterContactContent,
  getDefaultChapterHomepageContent,
  getPublishedManagedPageByChapterAndKey,
  parseChapterAboutContent,
  parseChapterContactContent,
  parseChapterHomepageContent,
} from "./db/pages";

export async function getChapterPublicContext(chapterSlug: string) {
  const chapter = await getChapterBySlug(chapterSlug);

  if (!chapter || chapter.status !== "active") {
    return null;
  }

  const [homepage, aboutPage, contactPage] = await Promise.all([
    getPublishedManagedPageByChapterAndKey(chapter.id, "chapter_home"),
    getPublishedManagedPageByChapterAndKey(chapter.id, "chapter_about"),
    getPublishedManagedPageByChapterAndKey(chapter.id, "chapter_contact"),
  ]);

  const defaultContentInput = {
    chapterName: chapter.name,
    country: chapter.country,
    contactEmail: chapter.contactEmail,
  };
  const defaultHomepageContent = getDefaultChapterHomepageContent(defaultContentInput);
  const defaultAboutContent = getDefaultChapterAboutContent(defaultContentInput);
  const defaultContactContent = getDefaultChapterContactContent(defaultContentInput);
  const homepageContent = homepage
    ? parseChapterHomepageContent(homepage.contentJson, defaultHomepageContent)
    : defaultHomepageContent;
  const aboutContent = aboutPage
    ? parseChapterAboutContent(aboutPage.contentJson, defaultAboutContent)
    : defaultAboutContent;
  const contactContent = contactPage
    ? parseChapterContactContent(contactPage.contentJson, defaultContactContent)
    : defaultContactContent;

  return {
    chapter,
    homepage,
    aboutPage,
    contactPage,
    homepageContent,
    aboutContent,
    contactContent,
  };
}
