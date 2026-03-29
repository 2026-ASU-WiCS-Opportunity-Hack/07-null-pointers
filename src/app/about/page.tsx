import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";
import { AboutExperience } from "../../components/AboutExperience";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <AboutExperience />
      <Footer />
    </div>
  );
}
