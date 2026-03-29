import { Globe } from "lucide-react";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <Globe className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">WIAL</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
  <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
    Home
  </Link>
  <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
    About Us
  </Link>
  <Link href="/certification" className="text-gray-600 hover:text-gray-900 transition-colors">
    Certification
  </Link>
  <Link href="/directory" className="text-gray-600 hover:text-gray-900 transition-colors">
    Directory
  </Link>
  <Link href="/events" className="text-gray-600 hover:text-gray-900 transition-colors">
    Events
  </Link>
  <Link href="/chapters" className="text-gray-600 hover:text-gray-900 transition-colors">
    Chapters
  </Link>
  <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
    Contact
  </Link>
</div>

          {/* Sign In Button */}
          <Link
            href="/signin"
            className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Sign In
          </Link>

        </div>
      </div>
    </nav>
  );
}
