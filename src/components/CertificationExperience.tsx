import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

type LevelKey = "CALC" | "PALC" | "SALC" | "MALC";

const certificationLevels = [
  {
    key: "CALC" as LevelKey,
    title: "Certified Action Learning Coach",
    tag: "Foundational practice",
    summary:
      "The foundational WIAL certification for professionals ready to coach Action Learning sessions with confidence.",
    details: [
      "Complete the required learning path, including Foundations or e-learning and the CALC workshop.",
      "Demonstrate real practice through WIAL Talk scenarios and live Action Learning sessions.",
      "Maintain certification through WIAL activity, Action Learning hours, and two-year renewal.",
    ],
    badge: "/calc-badge-real.png",
  },
  {
    key: "PALC" as LevelKey,
    title: "Professional Action Learning Coach",
    tag: "Applied experience",
    summary:
      "A step for experienced coaches who have proven their capability through real projects and sustained practice.",
    details: [
      "Designed for CALCs with at least 100 hours of WIAL coaching experience.",
      "Requires leading longer-term Action Learning work and observed facilitation.",
      "Renewed through Action Learning hours, WIAL activities, and continued professional involvement.",
    ],
    badge: "/palc-badge-real.png",
  },
  {
    key: "SALC" as LevelKey,
    title: "Senior Action Learning Coach",
    tag: "Program leadership",
    summary:
      "An advanced certification for leaders who can guide WIAL programs, coach others, and extend the reach of Action Learning.",
    details: [
      "Open to experienced CALCs or PALCs with substantial coaching hours.",
      "Includes leading core WIAL programs and helping develop other coaches.",
      "Maintained through teaching, mentoring, WIAL participation, and structured renewal.",
    ],
    badge: "/salc-badge-real.png",
  },
  {
    key: "MALC" as LevelKey,
    title: "Master Action Learning Coach",
    tag: "Thought leadership",
    summary:
      "The highest WIAL certification level for recognized experts and thought leaders in the Action Learning community.",
    details: [
      "Designed for senior SALCs with deep coaching experience and visible contribution.",
      "Requires thought leadership through publishing, presenting, or broader field contribution.",
      "Maintained through continued hours, mentoring, community leadership, and renewal requirements.",
    ],
    badge: "/malc-badge-real.png",
  },
];

const valuePillars = [
  {
    icon: Globe2,
    title: "Why get certified",
    description:
      "WIAL explains that a trained Action Learning coach is a key success factor for strong Action Learning programs.",
  },
  {
    icon: ShieldCheck,
    title: "Career and organizational value",
    description:
      "Certification helps professionals increase their credibility and value to organizations that want rigorous facilitation.",
  },
  {
    icon: Trophy,
    title: "A clear four-level ladder",
    description:
      "The pathway from CALC to MALC creates a visible progression in education, experience, and leadership responsibility.",
  },
];

const heroHighlights = [
  "Certified Action Learning coaches can coach Action Learning sessions.",
  "PALCs demonstrate deeper professional capability through applied experience.",
  "SALCs are cleared to lead all WIAL programs and help develop other coaches.",
  "MALCs are considered thought leaders within the Action Learning community.",
];

const badgeBenefits = [
  "Digital badges can display certification award dates, expiration dates, and demonstrated competencies.",
  "They can be shared on LinkedIn, email signatures, blogs, websites, and other professional channels.",
  "They give clients, employers, and partners a simple way to verify achievement in real time.",
];

const renewalPoints = [
  "Each certification level is described as valid for two years with a renewal process.",
  "Higher levels require deeper ongoing engagement, including coaching hours, WIAL activities, mentoring, and contribution.",
  "A stronger platform can make renewal more visible with reminders, progress tracking, and clearer status.",
];

function getLevelStyles() {
  return {
    leftPanel: "bg-blue-600",
    rightPanel: "border-blue-200 bg-blue-50",
    accentText: "text-blue-700",
    accentIcon: "text-blue-700",
  };
}

export function CertificationExperience() {
  return (
    <main className="pt-24">
      <section
        className="relative overflow-hidden px-6 pb-24 pt-12 text-white"
        style={{
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 46%, #0f766e 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.18),transparent_24%)]"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">
                Certification
              </p>
              <h1 className="max-w-5xl text-5xl font-bold leading-[0.92] text-white md:text-7xl">
                A visible pathway from certified practice to global leadership.
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-100">
                WIAL positions certification as a professional progression. The
                journey starts with CALC and expands through PALC, SALC, and
                MALC, with each level adding experience, responsibility, and
                recognition.
              </p>

              <div className="mt-8 grid gap-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/12 px-4 py-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-200" />
                    <p className="leading-relaxed text-white">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#levels"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-8 py-4 font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-200"
                >
                  Explore Levels
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#badges"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-4 font-semibold text-white transition hover:bg-white/8"
                >
                  Digital Badges
                  <BadgeCheck className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="space-y-5">
              <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/10 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                      Certification Snapshot
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-white">
                      Four levels. One trusted framework.
                    </h2>
                  </div>
                  <Sparkles className="h-6 w-6 shrink-0 text-cyan-200" />
                </div>
                <Image
                  src="/certification-hero.svg"
                  alt="WIAL certification pathway illustration"
                  width={960}
                  height={720}
                  className="h-auto w-full rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-3"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    Accredited
                  </p>
                  <p className="mt-3 text-2xl font-bold text-white">
                    ICF-recognized training
                  </p>
                  <p className="mt-3 leading-relaxed text-slate-100">
                    WIAL states that it is an ICF-accredited training provider
                    and that CALC is an accredited ICF CCE program.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    Badge-ready
                  </p>
                  <p className="mt-3 text-2xl font-bold text-white">
                    Recognition that travels
                  </p>
                  <p className="mt-3 leading-relaxed text-slate-100">
                    Certified coaches can share proof of achievement with
                    clients, employers, and partners through digital badges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-4 text-sm font-medium text-slate-700 md:grid-cols-4">
          <div className="rounded-full bg-slate-100 px-5 py-3 text-center shadow-sm">
            CALC {"->"} certified practice
          </div>
          <div className="rounded-full bg-slate-100 px-5 py-3 text-center shadow-sm">
            PALC {"->"} applied experience
          </div>
          <div className="rounded-full bg-slate-100 px-5 py-3 text-center shadow-sm">
            SALC {"->"} program leadership
          </div>
          <div className="rounded-full bg-slate-100 px-5 py-3 text-center shadow-sm">
            MALC {"->"} thought leadership
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-blue-600">
              Why It Matters
            </p>
            <h2 className="mb-5 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Certification should feel credible, visible, and worth pursuing.
            </h2>
            <p className="text-lg leading-relaxed text-slate-700">
              The official WIAL page frames certification as both a quality
              standard and a career signal. This version gives that story more
              structure and stronger visual rhythm.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {valuePillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="leading-relaxed text-slate-700">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="levels" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-blue-600">
              Four Levels of Certification
            </p>
            <h2 className="mb-5 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              A progression from first certification to recognized leadership.
            </h2>
            <p className="text-lg leading-relaxed text-slate-700">
              Each WIAL certification level expands the coach&apos;s scope of
              practice, contribution, and trust. This section now uses a
              cleaner, more compact presentation so each level feels complete
              without oversized empty panels.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {certificationLevels.map((level) => {
              const styles = getLevelStyles();

              return (
                <article
                  key={level.key}
                  className={`overflow-hidden rounded-[2.25rem] border ${styles.rightPanel} shadow-[0_20px_45px_rgba(15,23,42,0.06)]`}
                >
                  <div className={`${styles.leftPanel} p-8 text-white`}>
                    <div className="flex items-start gap-5">
                      <Image
                        src={level.badge}
                        alt={`${level.key} certification badge`}
                        width={104}
                        height={104}
                        className="h-20 w-20 shrink-0 rounded-full bg-white/10 p-1 object-contain"
                      />

                      <div className="min-w-0">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
                          {level.key}
                        </p>
                        <h3 className="text-3xl font-bold leading-tight">
                          {level.title}
                        </h3>
                        <div className="mt-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
                          {level.tag}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="text-lg leading-relaxed text-slate-700">
                      {level.summary}
                    </p>

                    <div className="mt-6 border-t border-slate-200 pt-6">
                      <p
                        className={`mb-5 text-sm font-semibold uppercase tracking-[0.18em] ${styles.accentText}`}
                      >
                        Key highlights
                      </p>
                      <ul className="space-y-4">
                        {level.details.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <CheckCircle2
                              className={`mt-0.5 h-5 w-5 shrink-0 ${styles.accentIcon}`}
                            />
                            <span className="leading-relaxed text-slate-700">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="px-6 py-24 text-white"
        style={{
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 55%, #134e4a 100%)",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2.25rem] border border-white/10 bg-white/10 p-8 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-sm">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-200">
                <CalendarClock className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200">
                  Renewal Rhythm
                </p>
                <h2 className="text-3xl font-bold text-white">
                  Recertification stays visible
                </h2>
              </div>
            </div>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-slate-100">
              WIAL&apos;s certification model is not only about earning a badge.
              It also requires continued practice, contribution, and renewal.
            </p>
            <div className="space-y-4">
              {renewalPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-white/10 bg-white/12 p-5"
                >
                  <p className="leading-relaxed text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            id="badges"
            className="rounded-[2.25rem] border border-slate-200 bg-white p-8 text-slate-900 shadow-[0_20px_45px_rgba(15,23,42,0.05)]"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <BadgeCheck className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
                  WIAL Certification Digital Badges
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  Portable proof of achievement
                </h3>
              </div>
            </div>

            <p className="mb-6 text-lg leading-relaxed text-slate-700">
              WIAL describes digital badging as a trusted way for certified
              coaches to share knowledge, skills, and achievement online, with
              verification that can be checked in real time.
            </p>

            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              {certificationLevels.map((level) => (
                <div
                  key={`${level.key}-badge`}
                  className="flex items-center gap-4 rounded-[1.5rem] bg-slate-50 p-4"
                >
                  <Image
                    src={level.badge}
                    alt={`${level.key} digital badge`}
                    width={84}
                    height={84}
                    className="h-16 w-16 shrink-0 rounded-full"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {level.key}
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {level.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <ul className="space-y-4">
              {badgeBenefits.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-[1.5rem] bg-slate-50 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <span className="leading-relaxed text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-10 text-center shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-blue-600">
            Have questions?
          </p>
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
            Learn more about WIAL certification.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-700">
            The official WIAL site invites prospective coaches to reach out with
            questions about certification. This page now gives that journey a
            clearer story while keeping the next step simple.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 font-semibold text-white transition hover:bg-blue-600"
            >
              Contact WIAL
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
