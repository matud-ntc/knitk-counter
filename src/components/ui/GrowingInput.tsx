"use client";

import { useEffect, useRef, useState, InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  minWidthCh?: number;
};

export default function GrowingInput({
  minWidthCh = 25,
  className,
  ...props
}: Props) {
  const [width, setWidth] = useState(minWidthCh);
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const syncWidth = () => {
    if (spanRef.current) {
      const textLength = spanRef.current.offsetWidth / 8; // aprox 1ch = 8px
      setWidth(Math.max(minWidthCh, Math.ceil(textLength)));
    }
  };

  useEffect(() => {
    syncWidth();
  }, [props.value]);

  return (
    <div className="relative block w-full">
      <input
        {...props}
        ref={inputRef}
        style={{ width: `${width}ch` }}
        className={clsx(
          "block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 focus:outline-none text-lg font-medium transition-all duration-200",
          className,
        )}
        onInput={syncWidth}
      />
      {/* Hidden span to measure text width */}
      <span
        ref={spanRef}
        className="absolute left-0 top-0 invisible whitespace-pre font-medium text-lg"
      >
        {props.value || ""}
      </span>
    </div>
  );
}
