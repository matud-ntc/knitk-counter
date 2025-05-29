"use client";

import { Dialog, Transition, Listbox } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

const THEMES = [
  { label: "🧡 Salmón", value: "theme-salmon" },
  { label: "🌸 Rosa fuerte", value: "theme-pink" },
  { label: "🔵 Azul eléctrico", value: "theme-electric" },
  { label: "🌑 Modo oscuro", value: "theme-dark" },
  { label: "🧊 Korean", value: "theme-korean" },
];

export default function ThemeSettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(THEMES[0]);

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "theme-salmon";
    const match = THEMES.find((t) => t.value === stored) || THEMES[0];
    setSelected(match);
    document.body.className = match.value;
  }, []);

  const handleChange = (theme: (typeof THEMES)[number]) => {
    setSelected(theme);
    document.body.className = theme.value;
    localStorage.setItem("theme", theme.value);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-10 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-6">
                  Ajustes
                </Dialog.Title>

                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium">Tema</label>

                  <Listbox value={selected} onChange={handleChange}>
                    <div className="relative w-48">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white py-2 pl-4 pr-10 text-left border border-[var(--color-primary)] shadow focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition font-medium text-gray-800">
                        <span className="block truncate">{selected.label}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <ChevronUpDownIcon className="h-5 w-5 text-[var(--color-primary)]" />
                        </span>
                      </Listbox.Button>

                      <Listbox.Options
                        as="ul"
                        className="absolute z-10 mt-2 w-full overflow-auto rounded-xl bg-white border border-[var(--color-primary)] shadow-lg max-h-60 focus:outline-none list-none p-0"
                      >
                        {THEMES.map((theme) => (
                          <Listbox.Option
                            key={theme.value}
                            value={theme}
                            as="li"
                          >
                            {({ active, selected }) => (
                              <div
                                className={`relative cursor-pointer select-none py-2 px-4 ${
                                  active ? "bg-[var(--color-primary)]/10" : ""
                                } ${selected ? "font-bold text-[var(--color-primary)]" : "text-gray-800"}`}
                              >
                                <span className="block truncate">
                                  {theme.label}
                                </span>
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
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
