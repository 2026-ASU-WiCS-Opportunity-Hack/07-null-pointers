import {
  Globe,
  Users,
  LayoutDashboard,
  Languages,
  Sparkles,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Unified Global Directory",
    description:
      "Access certified coaches from every chapter in one centralized, searchable platform",
    color: "blue",
  },
  {
    icon: Users,
    title: "Chapter-Based Management",
    description:
      "Each region maintains autonomy while benefiting from global infrastructure",
    color: "teal",
  },
  {
    icon: LayoutDashboard,
    title: "Role-Based Dashboards",
    description:
      "Customized interfaces for coaches, admins, and chapter leaders",
    color: "purple",
  },
  {
    icon: Languages,
    title: "Multilingual Support",
    description:
      "Platform available in multiple languages to serve our global community",
    color: "blue",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Search",
    description:
      "Intelligent matching connects you with the perfect coach for your needs",
    color: "teal",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description:
      "Enterprise-grade security protecting your data across all regions",
    color: "purple",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 px-6 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Platform Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive suite of tools designed for global collaboration
            and local impact
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            const colorClasses = {
              blue: "from-blue-500 to-blue-600",
              teal: "from-teal-500 to-teal-600",
              purple: "from-purple-500 to-purple-600",
            };

            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${
                    colorClasses[
                      feature.color as keyof typeof colorClasses
                    ]
                  } rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">
            Built for Scale, Designed for Impact
          </h3>

          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Our platform is engineered to support thousands of coaches across
            dozens of countries while maintaining the personal touch that makes
            action learning effective
          </p>

          <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg">
            Request a Demo
          </button>
        </div>

      </div>
    </section>
  );
}