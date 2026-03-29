import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";
import { EventsExperience } from "../../components/EventsExperience";
import { listPublicEvents } from "../../lib/db/events";

export default async function EventsPage() {
  const events = await listPublicEvents();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <EventsExperience events={events} />
      <Footer />
    </div>
  );
}
