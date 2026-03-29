"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ChapterContentEditor = "home" | "about" | "contact";

const OPTIONS: Array<{
  value: ChapterContentEditor;
  label: string;
}> = [
  { value: "home", label: "Homepage" },
  { value: "about", label: "About Us" },
  { value: "contact", label: "Contact" },
];

export function ChapterContentPageSelect({
  value,
}: {
  value: ChapterContentEditor;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(nextValue: ChapterContentEditor) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("editor", nextValue);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
      <span className="font-medium text-slate-500">Editing</span>
      <select
        value={value}
        onChange={(event) => handleChange(event.target.value as ChapterContentEditor)}
        className="bg-transparent font-semibold text-slate-900 outline-none"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
