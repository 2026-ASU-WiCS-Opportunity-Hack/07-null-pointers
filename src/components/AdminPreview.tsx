import {
  BarChart3,
  Users,
  Globe,
  TrendingUp,
  Award,
  Calendar,
} from "lucide-react";

export function AdminPreview() {
  return (
    <section
      id="admin"
      className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Powerful Admin Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive dashboards for global administrators and chapter leaders
          </p>
        </div>

        {/* Dashboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Global Dashboard */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Global Dashboard
              </h3>
              <Globe className="w-8 h-8 text-blue-600" />
            </div>

            {/* Stats */}
            <div className="space-y-4 mb-8">

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Coaches</div>
                    <div className="text-2xl font-bold text-gray-900">635</div>
                  </div>
                </div>
                <div className="text-green-600 font-semibold">+12%</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Active Chapters</div>
                    <div className="text-2xl font-bold text-gray-900">18</div>
                  </div>
                </div>
                <div className="text-green-600 font-semibold">+2</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Certifications</div>
                    <div className="text-2xl font-bold text-gray-900">1,240</div>
                  </div>
                </div>
                <div className="text-green-600 font-semibold">+8%</div>
              </div>

            </div>

            {/* Chart */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">
                  Monthly Growth
                </span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>

              <div className="flex items-end gap-2 h-32">
                {[40, 55, 45, 70, 60, 85, 75, 90].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-blue-600 to-teal-500 rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Chapter Dashboard */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Chapter Dashboard
              </h3>
              <BarChart3 className="w-8 h-8 text-teal-600" />
            </div>

            <div className="space-y-4 mb-8">

              {/* Chapter Card */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    WIAL Nigeria
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <div className="text-xs text-gray-600">Coaches</div>
                    <div className="text-xl font-bold text-gray-900">85</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Events</div>
                    <div className="text-xl font-bold text-gray-900">24</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Members</div>
                    <div className="text-xl font-bold text-gray-900">340</div>
                  </div>
                </div>
              </div>

              {/* Events */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">
                    Upcoming Events
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      title: "CALC Workshop",
                      date: "March 15, 2024",
                      rsvps: 24,
                    },
                    {
                      title: "Leadership Summit",
                      date: "April 2, 2024",
                      rsvps: 45,
                    },
                  ].map((event, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {event.date}
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {event.rsvps} RSVPs
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance */}
              <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl p-4 text-white">
                <div className="text-sm mb-2">Chapter Performance</div>
                <div className="text-3xl font-bold mb-2">92%</div>
                <div className="text-xs text-teal-100">Engagement Score</div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">
            Enterprise-Grade Administration
          </h3>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Manage your chapter or the entire global network with intuitive,
            data-driven dashboards designed for leadership excellence
          </p>
          <button className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg">
            Explore Admin Features
          </button>
        </div>

      </div>
    </section>
  );
}