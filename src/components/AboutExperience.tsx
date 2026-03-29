"use client";

import Image from "next/image";

import {
  BookOpen,
  Building2,
  Compass,
  Globe,
  History,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

const chapterPoints = [
  { id: 1, name: "USA", x: 21, y: 36 },
  { id: 2, name: "Brazil", x: 31, y: 67 },
  { id: 3, name: "Nigeria", x: 55, y: 46 },
  { id: 4, name: "Singapore", x: 76, y: 58 },
];


// const chapterPoints = backendChapters.map((chapter) => ({
//   id: chapter.id,
//   name: chapter.country,
//   x: chapter.mapX,
//   y: chapter.mapY,
// }));

const highlights = [
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "A growing international network of affiliates, coaches, and learning communities connected through one shared model.",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    icon: Building2,
    title: "Real-World Impact",
    description:
      "Organizations use Action Learning to solve urgent business problems while building stronger leaders and teams.",
    accent: "from-teal-500 to-emerald-500",
  },
  {
    icon: BookOpen,
    title: "Trusted Framework",
    description:
      "WIAL supports certification, standards, and practical leadership development through a globally recognized approach.",
    accent: "from-orange-500 to-rose-500",
  },
];

const frameworkCards = [
  {
    icon: Lightbulb,
    title: "Current State",
    description:
      "Many organizations still rely on approaches that no longer match the complexity of today’s people and performance challenges.",
    tone: "bg-white border-slate-200",
    iconTone: "bg-amber-100 text-amber-600",
  },
  {
    icon: Compass,
    title: "Vision",
    description:
      "WIAL believes organizations need better ways of thinking, collaborating, and solving real problems together.",
    tone: "bg-slate-900 border-slate-900",
    iconTone: "bg-white/10 text-white",
    dark: true,
  },
  {
    icon: Sparkles,
    title: "Mission",
    description:
      "WIAL helps teams unlock practical solutions while accelerating individual, team, and organizational development.",
    tone: "bg-[#f7f8fb] border-slate-200",
    iconTone: "bg-blue-100 text-blue-600",
  },
  {
    icon: Target,
    title: "Purpose",
    description:
      "To help transform ambitious organizations into places of continuous learning, stronger leadership, and meaningful progress.",
    tone: "bg-gradient-to-br from-blue-600 to-teal-600 border-transparent",
    iconTone: "bg-white/15 text-white",
    dark: true,
  },
];

const timeline = [
  {
    year: "1940s",
    title: "The origins of Action Learning",
    description:
      "Professor Reg Revans developed the foundations of Action Learning in the United Kingdom through collaborative questioning and reflection.",
  },
  {
    year: "1995",
    title: "A pivotal connection",
    description:
      "Michael Marquardt met Reg Revans, beginning a dialogue that helped shape what would become the WIAL model.",
  },
  {
    year: "Today",
    title: "A global leadership network",
    description:
      "WIAL now supports certification, chapter growth, and leadership development across a growing international community.",
  },
];

const chips = [
  "Global nonprofit network",
  "Coach certification",
  "Leadership development",
  "Action Learning in practice",
];



const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

export function AboutExperience() {
  return (
    <main className="pt-28">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-20 bg-gradient-to-b from-blue-50 via-white to-[#f7f8fb]">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.14),transparent_28%)]"
          animate={{ opacity: [0.72, 1, 0.82] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-16 right-12 h-32 w-32 rounded-full bg-blue-200/40 blur-3xl"
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute left-10 top-44 h-24 w-24 rounded-full bg-teal-200/50 blur-3xl"
          animate={{ y: [0, 16, 0], x: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="relative max-w-7xl mx-auto grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div className="max-w-4xl" variants={fadeUp}>
            <p className="text-sm tracking-[0.22em] uppercase text-blue-600 font-medium mb-4">
              About WIAL
            </p>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[0.95] mb-6">
              Advancing
              <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Action Learning Worldwide
              </span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mb-8">
              WIAL is the world’s leading certifying body for Action Learning,
              helping organizations, coaches, and chapters solve real problems
              while developing stronger leaders through a globally shared model.
            </p>

            <motion.div
              className="flex flex-wrap gap-3 mb-8"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {chips.map((tag) => (
                <motion.div
                  key={tag}
                  variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
                >
                  {tag}
                </motion.div>
              ))}
            </motion.div>

          </motion.div>

          {/* FUN VISUAL PANEL */}
          <motion.div variants={fadeUp} className="relative">
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35 }}
              className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)] min-h-[520px]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.24),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.18),transparent_30%)]" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-xs tracking-[0.22em] uppercase text-blue-200 font-semibold">
                      WIAL Network
                    </p>
                    <div className="flex gap-2">
                      <span className="h-3 w-3 rounded-full bg-blue-400" />
                      <span className="h-3 w-3 rounded-full bg-teal-400" />
                      <span className="h-3 w-3 rounded-full bg-orange-400" />
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-md">
                    One global model,
                    <span className="block text-blue-200">
                      many local communities.
                    </span>
                  </h2>
                </div>

                {/* network visual */}
                {/* network visual */}
<div className="relative my-10 h-[250px] rounded-[1.5rem] border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">

  {/* REAL WORLD MAP */}
  <div className="absolute inset-0 opacity-30">
    <Image
      src="/world-map.svg"
      alt="World map"
      fill
      className="object-contain p-4"
    />
  </div>

  {/* connecting lines */}
  <svg
    className="absolute inset-0 h-full w-full"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    {chapterPoints.map((p, i) =>
      i < chapterPoints.length - 1 ? (
        <line
          key={p.id}
          x1={p.x}
          y1={p.y}
          x2={chapterPoints[i + 1].x}
          y2={chapterPoints[i + 1].y}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.4"
        />
      ) : null
    )}
  </svg>

  {/* dynamic country points */}
  {chapterPoints.map((point, i) => (
    <motion.div
      key={point.id}
      className="absolute"
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3 + i, repeat: Infinity }}
    >
      <div className="relative">
        <div className="h-4 w-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)]" />
        <div className="absolute inset-0 rounded-full bg-cyan-300/40 blur-md scale-150" />
      </div>

      <div className="mt-2 text-xs text-white text-center bg-white/10 px-3 py-1 rounded-full backdrop-blur">
        {point.name}
      </div>
    </motion.div>
  ))}

  {/* center label */}
  {/* <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-semibold shadow">
    Shared Standards
  </div> */}
</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4">
                    <div className="text-xl font-bold text-white">18+</div>
                    <div className="text-xs text-slate-200 mt-1">
                      Chapters
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4">
                    <div className="text-xl font-bold text-white">600+</div>
                    <div className="text-xs text-slate-200 mt-1">
                      Coaches
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4">
                    <div className="text-xl font-bold text-white">Global</div>
                    <div className="text-xs text-slate-200 mt-1">
                      Community
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              aria-hidden="true"
              className="absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-3xl bg-orange-200/70 blur-2xl md:block"
              animate={{ scale: [1, 1.12, 1], opacity: [0.65, 0.95, 0.65] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* FRAMEWORK */}
      <motion.section
        className="px-6 pb-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="mb-12 max-w-3xl" variants={fadeUp}>
            <p className="text-sm tracking-[0.22em] uppercase text-blue-600 font-medium mb-4">
              The WIAL Framework
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">
              A more engaging way to understand what WIAL is building toward.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              These ideas reflect WIAL’s broader direction: the challenge
              organizations face today, the future WIAL believes in, and the
              practical role Action Learning plays in getting there.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-2"
            variants={stagger}
          >
            {frameworkCards.map((card, index) => {
              const Icon = card.icon;
              const offset =
                index === 1
                  ? "md:translate-y-6"
                  : index === 2
                  ? "md:-translate-y-2"
                  : "";

              return (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ duration: 0.28 }}
                  className={`rounded-[1.75rem] border p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)] ${card.tone} ${offset}`}
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconTone}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3
                    className={`mb-4 text-3xl font-bold ${
                      card.dark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`leading-relaxed text-lg ${
                      card.dark ? "text-slate-200" : "text-slate-600"
                    }`}
                  >
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>
        


{/* WHY WIAL */}
<motion.section
  className="px-6 pb-20 bg-[#f7f8fb]"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={stagger}
>
  <div className="max-w-7xl mx-auto">
    <motion.div className="mb-12 max-w-3xl" variants={fadeUp}>
      <p className="text-sm tracking-[0.22em] uppercase text-blue-600 font-medium mb-4">
        Why Organizations Choose WIAL
      </p>
      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">
        A proven model trusted across sectors and institutions.
      </h2>
      <p className="text-lg text-slate-600 leading-relaxed">
        WIAL’s Action Learning approach helps organizations improve
        collaboration, strengthen leadership, and develop practical
        solutions to real-world challenges.
      </p>
    </motion.div>

    <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] items-start">
      {/* Left Feature Card */}
      <motion.div
        variants={fadeUp}
        whileHover={{ y: -6 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-8 md:p-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.14),transparent_24%)]" />

        <div className="relative z-10">
          <p className="text-xs tracking-[0.22em] uppercase text-blue-200/90 font-medium mb-5">
            Mission And Vision
          </p>

          {/* Image + Heading */}
          <div className="grid gap-6 md:grid-cols-[240px_1fr] items-start">
            <div>
              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
                <Image
                  src="/founder.jpg"
                  alt="Founder portrait"
                  width={500}
                  height={700}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            <div className="pt-1">
              <h3 className="text-3xl md:text-4xl font-bold leading-tight max-w-xl">
                Leadership development through action, reflection, and shared
                learning.
              </h3>
            </div>
          </div>

          {/* Text continues below both columns */}
          <div className="mt-6 max-w-3xl">
            <p className="text-slate-200 text-lg leading-relaxed mb-5">
              Founded on the work of Dr. Michael Marquardt and inspired by Reg
              Revans, WIAL helps organizations solve urgent business
              challenges while developing stronger leaders and teams.
            </p>

            <p className="text-slate-300 leading-relaxed">
              WIAL serves as a global community for certification, learning,
              and organizational impact, while local affiliates bring that
              mission to life in their own regions.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right Highlight Stack */}
      <motion.div className="grid gap-5" variants={stagger}>
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              variants={fadeUp}
              whileHover={{ x: 6, y: -4 }}
              className="rounded-[1.5rem] bg-white border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.08)] px-7 py-7"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </div>
</motion.section>

      {/* TIMELINE */}
      <motion.section
        className="px-6 pb-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={stagger}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="mb-12 max-w-3xl" variants={fadeUp}>
            <p className="text-sm tracking-[0.22em] uppercase text-blue-600 font-medium mb-4">
              WIAL History
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">
              From early Action Learning roots to a global leadership community.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              WIAL’s story combines the early foundations of Action Learning
              with decades of refinement, practical testing, and global growth.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-blue-300 via-teal-300 to-orange-300 md:left-1/2" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  variants={fadeUp}
                  className={`relative grid md:grid-cols-2 gap-6 items-start ${
                    index % 2 === 0 ? "" : ""
                  }`}
                >
                  <div
                    className={`${
                      index % 2 === 0 ? "md:pr-10" : "md:order-2 md:pl-10"
                    }`}
                  >
                    <div className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
                      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 mb-3">
                        {item.year}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className={`${index % 2 === 0 ? "md:pl-10" : "md:order-1 md:pr-10"}`}>
                    <div className="hidden md:flex h-full items-center">
                      <div className="rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-teal-600 text-white px-6 py-5 shadow-[0_18px_40px_rgba(37,99,235,0.18)]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                            <History className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-sm uppercase tracking-[0.18em] text-blue-100">
                              Timeline
                            </div>
                            <div className="text-lg font-semibold">
                              {item.year}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-5 top-8 h-4 w-4 -translate-x-1/2 rounded-full bg-white border-4 border-blue-500 md:left-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
