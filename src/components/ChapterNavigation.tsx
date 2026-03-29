import { Globe } from "lucide-react";
import Link from "next/link";

export function ChapterNavigation({
  chapterName,
  chapterSlug,
}: {
  chapterName: string;
  chapterSlug: string;
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href={`/${chapterSlug}`}
            className="flex items-center space-x-2 transition hover:opacity-80"
          >
            <Globe className="h-8 w-8 text-blue-600" />
            <div className="leading-tight">
              <span className="block text-2xl font-bold text-gray-900">WIAL</span>
              <span className="block text-xs font-medium uppercase tracking-[0.18em] text-blue-600">
                {chapterName}
              </span>
            </div>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href={`/${chapterSlug}`}
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href={`/${chapterSlug}/about`}
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              About Us
            </Link>
            <Link
              href="/#certification"
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              Certification
            </Link>
            <Link
              href={`/${chapterSlug}/directory`}
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              Directory
            </Link>
            <Link
              href={`/${chapterSlug}/events`}
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              Events
            </Link>
            <Link
              href="/chapters"
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              Chapters
            </Link>
            <Link
              href={`/${chapterSlug}/contact`}
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              Contact
            </Link>
          </div>

          <Link
            href="/signin"
            className="px-6 py-2 font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
