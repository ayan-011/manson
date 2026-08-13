"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      const computedCursor = window.getComputedStyle(target).cursor;
      setIsPointer(computedCursor === "pointer");
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <img
        src="/cursor.png"
        alt=""
        className={`pointer-events-none select-none fixed z-[9999] w-10 h-10 hidden lg:block ${
          isPointer ? "opacity-0" : "opacity-100"
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      />
      <style jsx global>{`
        @media (min-width: 1024px) {
          * {
            cursor: none;
          }
          a,
          button,
          [role="button"],
          .cursor-pointer {
            cursor: pointer !important;
          }
        }
      `}</style>
    </>
  );
}