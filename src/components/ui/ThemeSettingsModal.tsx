// components/ui/ThemeSettingsModal.tsx
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Button from "@/components/ui/Button";

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
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "theme-salmon";
    setSelected(stored);
  }, []);

  const applyTheme = (theme: string) => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
    setSelected(theme);
    onClose();
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
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Ajustes de tema
                </Dialog.Title>
                <div className="space-y-3">
                  {THEMES.map((theme) => (
                    <Button
                      key={theme.value}
                      onClick={() => applyTheme(theme.value)}
                      variant={
                        selected === theme.value ? "primary" : "secondary"
                      }
                      className="w-full"
                    >
                      {theme.label}
                    </Button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
