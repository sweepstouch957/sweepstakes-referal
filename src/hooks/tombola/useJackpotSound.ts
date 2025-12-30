"use client";

import { useCallback, useRef, useState } from "react";

export function useJackpotSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const unlockedRef = useRef(false);

  const unlock = useCallback(async () => {
    if (unlockedRef.current) return;
    const a = audioRef.current;
    if (!a) return;

    try {
      a.muted = true;
      await a.play();
      a.pause();
      a.currentTime = 0;
      a.muted = false;
      unlockedRef.current = true;
    } catch {
      // no-op
    }
  }, []);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!soundOn) return;
    if (!unlockedRef.current) return;

    a.currentTime = 0;
    a.play().catch(() => {});
  }, [soundOn]);

  return {
    audioRef,
    soundOn,
    setSoundOn,
    unlock,
    play,
    isUnlockedRef: unlockedRef,
  };
}
