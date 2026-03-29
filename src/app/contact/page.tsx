import { ContactExperience } from "../../components/ContactExperience";
import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <ContactExperience />
      <Footer />
    </div>
  );
}
