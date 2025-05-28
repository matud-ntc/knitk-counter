"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Section = {
  id: string;
  name: string;
};

type Props = {
  sections: Section[];
  currentId: string;
};

export default function SectionSelector({ sections, currentId }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    const url = new URL(window.location.href);
    url.searchParams.set("section", newId);
    router.push(url.toString());
  };

  return (
    <div className="mb-4">
      <select
        value={currentId}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
      >
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
