import { Navigation } from "../../components/Navigation";
import { Chapters } from "../../components/Chapters";
import { Footer } from "../../components/Footer";

export default function ChaptersPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24">
        <Chapters />
      </main>
      <Footer />
    </div>
  );
}