"use client";

import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const onScroll = () => {
      const offset = window.innerWidth < 768 ? 180 : 140;
      const scrollPosition = window.scrollY + offset;

      let currentSection = sectionIds[0] ?? "";

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) {
          return;
        }

        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (scrollPosition >= top && scrollPosition < bottom) {
          currentSection = id;
        }
      });

      setActiveId(currentSection);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionIds]);

  return activeId;
}
