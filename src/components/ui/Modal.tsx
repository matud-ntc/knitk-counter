"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import clsx from "clsx";

type Props = {
  open?: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Modal({
  open = true,
  onClose,
  title,
  children,
  className,
}: Props) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Fondo más sutil */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        </Transition.Child>

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
              <Dialog.Panel
                className={clsx(
                  "w-full max-w-md transform rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] px-6 py-8 text-left align-middle shadow-float transition-all",
                  className,
                )}
              >
                <div className="mb-4 flex items-center justify-between">
                  {title ? (
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold leading-6 text-[var(--foreground)]"
                    >
                      {title}
                    </Dialog.Title>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-2)] border border-[var(--border-soft)] text-[var(--muted-fg)] active:scale-95 transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
