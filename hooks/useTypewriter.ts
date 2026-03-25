"use client";

import { useEffect, useMemo, useState } from "react";

type UseTypewriterParams = {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
};

export function useTypewriter({
  words,
  typingSpeed = 80,
  deletingSpeed = 55,
  pauseMs = 1200
}: UseTypewriterParams) {
  const safeWords = useMemo(() => words.filter(Boolean), [words]);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (safeWords.length === 0) {
      return;
    }

    const currentWord = safeWords[wordIndex % safeWords.length];
    const finishedTyping = displayText === currentWord;
    const finishedDeleting = displayText.length === 0;

    const delay = isDeleting ? deletingSpeed : typingSpeed;
    let timeoutId: ReturnType<typeof setTimeout>;

    if (!isDeleting && finishedTyping) {
      timeoutId = setTimeout(() => setIsDeleting(true), pauseMs);
      return () => clearTimeout(timeoutId);
    }

    if (isDeleting && finishedDeleting) {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % safeWords.length);
      return;
    }

    timeoutId = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting ? currentWord.slice(0, prev.length - 1) : currentWord.slice(0, prev.length + 1)
      );
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [safeWords, wordIndex, displayText, isDeleting, typingSpeed, deletingSpeed, pauseMs]);

  return displayText;
}
