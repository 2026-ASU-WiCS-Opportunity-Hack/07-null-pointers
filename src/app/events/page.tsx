import { connection } from "next/server";

import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";
import { EventsExperience } from "../../components/EventsExperience";
import { listPublicEvents, type PublicEventWithChapter } from "../../lib/db/events";

export default async function EventsPage() {
  await connection();
  let events: PublicEventWithChapter[] = [];

  try {
    events = await listPublicEvents();
  } catch (error) {
    console.error("Failed to load public events.", error);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <EventsExperience events={events} />
      <Footer />
    </div>
  );
}
