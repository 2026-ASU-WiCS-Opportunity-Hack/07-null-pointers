import { Search, MapPin, Filter } from "lucide-react";

const coaches = [
  {
    name: "Dr. Sarah Johnson",
    level: "SALC",
    location: "New York, USA",
    specialties: ["Executive Coaching", "Team Development"],
  },
  {
    name: "Michael Chen",
    level: "PALC",
    location: "Singapore",
    specialties: ["Leadership", "Innovation"],
  },
  {
    name: "Amara Okafor",
    level: "CALC",
    location: "Lagos, Nigeria",
    specialties: ["Change Management", "Culture"],
  },
  {
    name: "Carlos Silva",
    level: "SALC",
    location: "São Paulo, Brazil",
    specialties: ["Strategy", "Team Building"],
  },
];

export function CoachDirectory() {
  return (
    <section id="directory" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Find Your Coach
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with certified action learning coaches worldwide
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 mb-12 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialty, or location..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white"
              />
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-4 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </button>

              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Coach Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coaches.map((coach, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:-translate-y-2"
            >

              {/* Placeholder Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-3xl font-bold">
                {coach.name.charAt(0)}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {coach.name}
                  </h3>

                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    {coach.level}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-gray-600 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{coach.location}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {coach.specialties.map((specialty, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-medium group-hover:bg-blue-600 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Showing 4 of 635 certified coaches worldwide
          </p>

          <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30">
            View Full Directory
          </button>
        </div>
      </div>
    </section>
  );
}