// import { Globe, MapPin, Users } from "lucide-react";

// export function GlobalLocal() {
//   return (
//     <section
//       id="chapters"
//       className="py-24 px-6 bg-white"
//     >
//       <div className="max-w-7xl mx-auto">

//         {/* Heading */}
//         <div className="text-center mb-16">
//           <h2 className="text-5xl font-bold text-gray-900 mb-4">
//             Global Structure. Local Impact.
//           </h2>
//           <p className="text-xl text-gray-600">
//             One unified platform connecting independent chapters worldwide
//           </p>
//         </div>

//         {/* Main Layout */}
//         <div className="relative">
//           <div className="flex flex-col md:flex-row items-center justify-center gap-8">

//             {/* Global Card */}
//             <div className="flex-1 max-w-sm">
//               <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl hover:scale-105 transition-transform">
//                 <Globe className="w-12 h-12 mb-4" />
//                 <h3 className="text-2xl font-bold mb-3">Global Platform</h3>
//                 <p className="text-blue-100 leading-relaxed">
//                   Centralized system, unified standards, shared resources, and seamless collaboration
//                 </p>

//                 <div className="mt-6 space-y-2">
//                   <div className="bg-white/20 rounded-lg px-4 py-2 text-sm backdrop-blur-sm">
//                     ✓ Unified Directory
//                   </div>
//                   <div className="bg-white/20 rounded-lg px-4 py-2 text-sm backdrop-blur-sm">
//                     ✓ Global Standards
//                   </div>
//                   <div className="bg-white/20 rounded-lg px-4 py-2 text-sm backdrop-blur-sm">
//                     ✓ Shared Resources
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Connector */}
//             <div className="flex flex-col gap-4">
//               {[1, 2, 3].map((_, i) => (
//                 <div
//                   key={i}
//                   className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center"
//                 >
//                   <div className="w-6 h-0.5 bg-white"></div>
//                 </div>
//               ))}
//             </div>

//             {/* Chapter Cards */}
//             <div className="flex-1 space-y-4 max-w-sm">

//               <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-teal-500 transition-colors hover:scale-105 transform duration-200">
//                 <div className="flex items-center gap-3 mb-2">
//                   <MapPin className="w-6 h-6 text-teal-600" />
//                   <h4 className="font-bold text-gray-900">WIAL USA</h4>
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   Local leadership, culture, and community impact
//                 </p>
//               </div>

//               <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-purple-500 transition-colors hover:scale-105 transform duration-200">
//                 <div className="flex items-center gap-3 mb-2">
//                   <MapPin className="w-6 h-6 text-purple-600" />
//                   <h4 className="font-bold text-gray-900">WIAL Nigeria</h4>
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   Local leadership, culture, and community impact
//                 </p>
//               </div>

//               <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-blue-500 transition-colors hover:scale-105 transform duration-200">
//                 <div className="flex items-center gap-3 mb-2">
//                   <MapPin className="w-6 h-6 text-blue-600" />
//                   <h4 className="font-bold text-gray-900">WIAL Brazil</h4>
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   Local leadership, culture, and community impact
//                 </p>
//               </div>

//             </div>
//           </div>

//           {/* Bottom Features */}
//           <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">

//             <div className="text-center p-6">
//               <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <Users className="w-8 h-8 text-blue-600" />
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">
//                 Unified Community
//               </h3>
//               <p className="text-gray-600 text-sm">
//                 One global network of certified coaches and leaders
//               </p>
//             </div>

//             <div className="text-center p-6">
//               <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <Globe className="w-8 h-8 text-teal-600" />
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">
//                 Global Standards
//               </h3>
//               <p className="text-gray-600 text-sm">
//                 Consistent certification and quality across all regions
//               </p>
//             </div>

//             <div className="text-center p-6">
//               <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <MapPin className="w-8 h-8 text-purple-600" />
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">
//                 Local Autonomy
//               </h3>
//               <p className="text-gray-600 text-sm">
//                 Each chapter maintains independence and cultural identity
//               </p>
//             </div>

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



//// 2nd code 

// import { ArrowRight } from "lucide-react";

// const highlights = [
//   {
//     eyebrow: "ACTION LEARNING",
//     title: "What is Action Learning?",
//     description:
//       "A practical leadership method that helps teams solve real problems while learning together.",
//     accent: "text-blue-600",
//   },
//   {
//     eyebrow: "GLOBAL CHAPTERS",
//     title: "One Platform, Many Local Communities",
//     description:
//       "Chapters around the world share one trusted structure while maintaining local identity and impact.",
//     accent: "text-teal-600",
//   },
//   {
//     eyebrow: "COACH DIRECTORY",
//     title: "Search for Certified Coaches",
//     description:
//       "Discover qualified coaches by chapter, specialty, certification level, and region.",
//     accent: "text-purple-600",
//   },
//   {
//     eyebrow: "CERTIFICATION",
//     title: "Built on Recognized Standards",
//     description:
//       "Support leadership development through a globally consistent framework for action learning.",
//     accent: "text-orange-500",
//   },
// ];

// export function GlobalLocal() {
//   return (
//     <section id="about" className="py-24 px-6 bg-[#f7f8fb]">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-14 text-center">
//           <p className="text-sm tracking-[0.22em] uppercase text-blue-600 font-medium mb-4">
//             WIAL Global
//           </p>
//           <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
//             Leadership Learning,
//             <span className="block">Connected Globally</span>
//           </h2>
//           <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
//             Explore a modern global platform for action learning, chapter growth,
//             coach discovery, and leadership development.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-[1.65fr_0.9fr] gap-8 items-stretch">
//           {/* Left Feature Panel */}
//           <div className="relative overflow-hidden rounded-[2rem] min-h-[560px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
//             {/* Background glow */}
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.18),transparent_32%)]" />

//             {/* Decorative blocks */}
//             <div className="absolute top-10 right-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
//             <div className="absolute bottom-16 left-10 h-36 w-36 rounded-full bg-blue-400/20 blur-3xl" />

//             <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-12">
//               <div className="max-w-xl">
//                 <p className="text-xs md:text-sm tracking-[0.22em] uppercase text-blue-200/90 font-medium mb-5">
//                   Action Learning
//                 </p>

//                 <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5">
//                   A Smarter Way to Build
//                   <span className="block">Leadership in Action</span>
//                 </h3>

//                 <p className="text-base md:text-lg text-slate-200 leading-relaxed max-w-lg">
//                   WIAL brings together global standards, local chapters, certified
//                   coaches, and leadership communities in one unified digital
//                   experience.
//                 </p>

//                 <div className="mt-8 flex flex-wrap gap-3">
//                   <button className="px-6 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-100 transition">
//                     Explore Chapters
//                   </button>
//                   <button className="px-6 py-3 rounded-full border border-white/25 bg-white/10 text-white font-semibold hover:bg-white/15 transition inline-flex items-center gap-2">
//                     Find a Coach
//                     <ArrowRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Bottom cards inside feature panel */}
//               <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-5">
//                   <div className="text-2xl font-bold text-white">18+</div>
//                   <div className="text-sm text-slate-200 mt-1">Active chapters</div>
//                 </div>
//                 <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-5">
//                   <div className="text-2xl font-bold text-white">600+</div>
//                   <div className="text-sm text-slate-200 mt-1">Certified coaches</div>
//                 </div>
//                 <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-5">
//                   <div className="text-2xl font-bold text-white">Global</div>
//                   <div className="text-sm text-slate-200 mt-1">Shared standards</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right stacked panels */}
//           <div className="flex flex-col gap-5">
//             {highlights.map((item, index) => (
//               <div
//                 key={index}
//                 className="group rounded-[1.5rem] bg-white border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.08)] px-7 py-7 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition-all"
//               >
//                 <p className={`text-xs tracking-[0.18em] uppercase font-medium mb-3 ${item.accent}`}>
//                   {item.eyebrow}
//                 </p>
//                 <h4 className="text-2xl font-bold text-slate-900 mb-3 leading-snug">
//                   {item.title}
//                 </h4>
//                 <p className="text-slate-600 leading-relaxed">
//                   {item.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


import { ArrowRight } from "lucide-react";

const highlights = [
  {
    eyebrow: "ACTION LEARNING",
    title: "What is Action Learning?",
    description:
      "A practical leadership method that helps teams solve real problems while learning together.",
    accent: "text-blue-600",
  },
  {
    eyebrow: "GLOBAL CHAPTERS",
    title: "One Platform, Many Local Communities",
    description:
      "Chapters around the world share one trusted structure while maintaining local identity and impact.",
    accent: "text-teal-600",
  },
  {
    eyebrow: "COACH DIRECTORY",
    title: "Search for Certified Coaches",
    description:
      "Discover qualified coaches by chapter, specialty, certification level, and region.",
    accent: "text-purple-600",
  },
  {
    eyebrow: "CERTIFICATION",
    title: "Built on Recognized Standards",
    description:
      "Support leadership development through a globally consistent framework for action learning.",
    accent: "text-orange-500",
  },
];

export function GlobalLocal() {
  return (
    <section id="about" className="py-24 px-6 bg-[#f7f8fb]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          <p className="text-sm tracking-[0.22em] uppercase text-blue-600 font-medium mb-4">
            WIAL Global
          </p>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
            Leadership Learning,
            <span className="block">Connected Globally</span>
          </h2>
          <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Explore a modern global platform for action learning, chapter growth,
            coach discovery, and leadership development.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.65fr_0.9fr] gap-8 items-stretch">
          {/* Left Video Panel */}
          <div className="relative overflow-hidden rounded-[2rem] min-h-[560px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.20),transparent_32%)]" />

            <div className="relative z-10 flex h-full flex-col p-6 md:p-8">
              <div className="mb-6">
                <p className="text-xs tracking-[0.22em] uppercase text-blue-200/90 font-medium mb-3">
                  Action Learning
                </p>

                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  See WIAL in Action
                </h3>
              </div>

              <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 shadow-lg min-h-[360px]">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/gyGM7lm8Tbs"
                  title="WIAL Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="mt-6 flex gap-3 flex-wrap">
                <button className="px-5 py-2.5 rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-100 transition">
                  Explore Chapters
                </button>

                <button className="px-5 py-2.5 rounded-full border border-white/20 bg-white/10 text-white font-semibold hover:bg-white/15 transition inline-flex items-center gap-2">
                  Find a Coach
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right stacked panels */}
          <div className="flex flex-col gap-5">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="group rounded-[1.5rem] bg-white border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.08)] px-7 py-7 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition-all"
              >
                <p
                  className={`text-xs tracking-[0.18em] uppercase font-medium mb-3 ${item.accent}`}
                >
                  {item.eyebrow}
                </p>
                <h4 className="text-2xl font-bold text-slate-900 mb-3 leading-snug">
                  {item.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}