"use client";

import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useRouter, useSearchParams } from "next/navigation";

export type SectionOption = {
  id: string;
  name: string;
};

type Props = {
  options: SectionOption[];
  currentId: string;
};

export default function SectionSelect({ options, currentId }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const current = options.find((opt) => opt.id === currentId) ?? options[0];

  const handleChange = (newValue: SectionOption) => {
    const url = new URL(window.location.href);
    url.searchParams.set("section", newValue.id);
    router.replace(url.toString());
  };

  return (
    <Listbox value={current} onChange={handleChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left border border-pink-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition font-semibold text-gray-800">
          <span className="block truncate">{current.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronUpDownIcon className="h-5 w-5 text-pink-500" />
          </span>
        </Listbox.Button>

        <Listbox.Options
          as="ul"
          className="absolute z-10 mt-2 w-full overflow-auto rounded-xl bg-white border border-pink-200 shadow-lg max-h-60 focus:outline-none list-none p-0"
        >
          {options.map((option) => (
            <Listbox.Option key={option.id} value={option} as="li">
              {({ active, selected }) => (
                <div
                  className={`relative cursor-pointer select-none py-3 px-4 ${
                    active ? "bg-pink-50" : ""
                  } ${selected ? "font-bold text-pink-600" : "text-gray-800"}`}
                >
                  <span className="block truncate">{option.name}</span>
                  {selected && (
                    <span className="absolute inset-y-0 right-4 flex items-center text-lg">
                      🧶
                    </span>
                  )}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
