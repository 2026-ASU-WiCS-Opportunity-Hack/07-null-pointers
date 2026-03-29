import { Navigation } from "../components/Navigation";
import { Hero } from "../components/Hero";
import { GlobalLocal } from "../components/GlobalLocal";
// import { Chapters } from "../components/Chapters";
// import { CoachDirectory } from "../components/CoachDirectory";
// import { Features } from "../components/Features";
// import { HowItWorks } from "../components/HowItWorks";
// import { AdminPreview } from "../components/AdminPreview";
import { Footer } from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <GlobalLocal />
      {/* <CoachDirectory /> */}
      {/* <Features /> */}
      {/* <HowItWorks /> */}
      {/* <AdminPreview /> */}
      <Footer />
    </div>
  );
}