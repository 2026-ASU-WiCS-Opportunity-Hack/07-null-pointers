import { connection } from "next/server";

import { Footer } from "../../components/Footer";
import { GlobalDirectoryExperience } from "../../components/GlobalDirectoryExperience";
import { Navigation } from "../../components/Navigation";
import {
  listPublishedCoachesForDirectory,
  type CoachWithChapter,
} from "../../lib/db/coaches";

export default async function GlobalDirectoryPage() {
  await connection();
  let coaches: CoachWithChapter[] = [];

  try {
    coaches = await listPublishedCoachesForDirectory();
  } catch (error) {
    console.error("Failed to load global directory coaches.", error);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <GlobalDirectoryExperience coaches={coaches} />
      <Footer />
    </div>
  );
}
