import { ArrowRight, Users, MapPin } from "lucide-react";

const chapters = [
  {
    name: "WIAL USA",
    flag: "🇺🇸",
    description:
      "Leading action learning initiatives across North America with certified coaches",
    coaches: 150,
  },
  {
    name: "WIAL Nigeria",
    flag: "🇳🇬",
    description:
      "Empowering African leadership through action learning methodologies",
    coaches: 85,
  },
  {
    name: "WIAL Brazil",
    flag: "🇧🇷",
    description:
      "Fostering collaborative leadership development across South America",
    coaches: 120,
  },
  {
    name: "WIAL Singapore",
    flag: "🇸🇬",
    description:
      "Advancing action learning practices throughout Asia-Pacific region",
    coaches: 95,
  },
  {
    name: "WIAL UK",
    flag: "🇬🇧",
    description:
      "Connecting European coaches and leaders through action learning",
    coaches: 110,
  },
  {
    name: "WIAL Australia",
    flag: "🇦🇺",
    description:
      "Building leadership capacity across Australia and New Zealand",
    coaches: 75,
  },
];

export function Chapters() {
  return (
    <section
      id="chapters"
      className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Global Chapters
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our worldwide network of action learning communities,
            each bringing unique perspectives and local expertise
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">{chapter.flag}</div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {chapter.name}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed min-h-[60px]">
                {chapter.description}
              </p>

              <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{chapter.coaches} Coaches</span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Active</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold group-hover:bg-blue-600 transition-colors">
                View Chapter
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200 inline-flex items-center gap-2">
            View All Chapters
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}