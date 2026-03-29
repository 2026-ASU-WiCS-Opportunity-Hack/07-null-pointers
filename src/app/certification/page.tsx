import { CertificationExperience } from "../../components/CertificationExperience";
import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";

export default function CertificationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <CertificationExperience />
      <Footer />
    </div>
  );
}
