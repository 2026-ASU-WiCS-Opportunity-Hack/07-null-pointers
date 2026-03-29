import { Search, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      id="about"
      className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            A Global Platform for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Action Learning Leadership
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Connecting leadership coaches worldwide through a unified platform,
            empowering local chapters to create impact in their communities
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="group px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-blue-600/30">
              Find a Coach
              <Search className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200 flex items-center gap-2">
              Explore Chapters
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          </div>
      </div>
    </section>
  );
}