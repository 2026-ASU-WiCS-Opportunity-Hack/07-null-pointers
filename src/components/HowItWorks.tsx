import { UserPlus, MapPin, Users, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Join the Platform",
    description:
      "Create your account and complete your profile with your leadership goals",
    number: "01",
  },
  {
    icon: MapPin,
    title: "Choose Your Chapter",
    description:
      "Select your local or regional chapter to connect with nearby coaches",
    number: "02",
  },
  {
    icon: Users,
    title: "Connect with a Coach",
    description:
      "Browse certified coaches and find the perfect match for your needs",
    number: "03",
  },
  {
    icon: TrendingUp,
    title: "Learn & Grow",
    description:
      "Begin your action learning journey and develop leadership excellence",
    number: "04",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with WIAL Global in four simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">

          {/* Line connector */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-teal-200 to-purple-200"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300">

                  {/* Icon + number */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Text */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-center">
                    {step.description}
                  </p>

                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30">
            Get Started Today
          </button>
        </div>

      </div>
    </section>
  );
}