import { Footer } from "../../components/Footer";
import { GlobalDirectoryExperience } from "../../components/GlobalDirectoryExperience";
import { Navigation } from "../../components/Navigation";
import { listPublishedCoachesForDirectory } from "../../lib/db/coaches";

export default async function GlobalDirectoryPage() {
  const coaches = await listPublishedCoachesForDirectory();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <GlobalDirectoryExperience coaches={coaches} />
      <Footer />
    </div>
  );
}
