"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Winner } from "@/hooks/useLotteryData";
import { formatPhoneNumber } from "@/utils/confetti";
import { pickRandom } from "@/utils/tombola/random";
import {
  attachSegmentLoop,
  detachSegmentLoop,
  jumpToEndIfInsideLoop,
  type LoopConfig,
} from "@/utils/tombola/videoLoop";

export type Phase = "idle" | "spinning" | "revealing" | "done";

type Params = {
  participantsSample: Winner[];
  participantCount?: number;
  isLoading: boolean;
  isError: boolean;
  loopConfig: LoopConfig;
};

export function useTombolaEngine({
  participantsSample,
  participantCount,
  isLoading,
  isError,
  loopConfig,
}: Params) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loopActiveRef = useRef(false);
  const timeUpdateHandlerRef = useRef<((this: HTMLVideoElement, ev: Event) => any) | null>(null);

  const spinTimerRef = useRef<number | null>(null);
  const winnerDelayRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [currentSpin, setCurrentSpin] = useState<Winner | null>(null);
  const [finalWinner, setFinalWinner] = useState<Winner | null>(null);
  const [keyTick, setKeyTick] = useState(0);
  const [winnerSpotlight, setWinnerSpotlight] = useState(false);

  const canStart =
    !isLoading &&
    !isError &&
    participantsSample.length > 0 &&
    phase !== "spinning" &&
    phase !== "revealing";

  const canStop = phase === "spinning";

  const formattedParticipants = useMemo(() => {
    const n = participantCount ?? 0;
    return n.toLocaleString();
  }, [participantCount]);

  const displayPhoneForAnim = useMemo(() => {
    return formatPhoneNumber(currentSpin?.phone ?? "");
  }, [currentSpin]);

  const displayPhoneFinal = useMemo(() => {
    return formatPhoneNumber(finalWinner?.phone ?? "");
  }, [finalWinner]);

  const cleanupTimers = useCallback(() => {
    if (spinTimerRef.current) window.clearInterval(spinTimerRef.current);
    if (winnerDelayRef.current) window.clearTimeout(winnerDelayRef.current);
    spinTimerRef.current = null;
    winnerDelayRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupTimers();
      const v = videoRef.current;
      if (v) detachSegmentLoop(v, timeUpdateHandlerRef);
    };
  }, [cleanupTimers]);

  const startSpinning = useCallback(async () => {
    if (!canStart) return;

    setFinalWinner(null);
    setWinnerSpotlight(false);
    setPhase("spinning");

    const v = videoRef.current;
    if (v) {
      loopActiveRef.current = true;
      v.loop = false;
      v.currentTime = 0;

      detachSegmentLoop(v, timeUpdateHandlerRef);
      attachSegmentLoop(v, loopConfig, loopActiveRef, timeUpdateHandlerRef);

      try {
        await v.play();
      } catch {
        // autoplay policy
      }
    }

    setCurrentSpin(pickRandom(participantsSample));
    setKeyTick((k) => k + 1);

    cleanupTimers();
    spinTimerRef.current = window.setInterval(() => {
      setCurrentSpin(pickRandom(participantsSample));
      setKeyTick((k) => k + 1);
    }, 900);
  }, [canStart, cleanupTimers, loopConfig, participantsSample]);

  const stopSpinningAndReveal = useCallback(async () => {
    if (!canStop) return;

    if (spinTimerRef.current) {
      window.clearInterval(spinTimerRef.current);
      spinTimerRef.current = null;
    }

    setPhase("revealing");
    setWinnerSpotlight(true);

    const v = videoRef.current;
    if (v) {
      loopActiveRef.current = false;
      v.loop = false;

      detachSegmentLoop(v, timeUpdateHandlerRef);
      jumpToEndIfInsideLoop(v, loopConfig);

      v.play().catch(() => {});
    }

    const winner = currentSpin ?? pickRandom(participantsSample);

    if (winnerDelayRef.current) window.clearTimeout(winnerDelayRef.current);
    winnerDelayRef.current = window.setTimeout(() => {
      setFinalWinner(winner);
      setPhase("done");

      window.setTimeout(() => setWinnerSpotlight(false), 1200);
    }, 2000);
  }, [canStop, currentSpin, loopConfig, participantsSample]);

  return {
    // refs
    videoRef,

    // state
    phase,
    currentSpin,
    finalWinner,
    keyTick,
    winnerSpotlight,

    // computed
    canStart,
    canStop,
    formattedParticipants,
    displayPhoneForAnim,
    displayPhoneFinal,

    // actions
    startSpinning,
    stopSpinningAndReveal,

    // setters (if you ever need)
    setFinalWinner,
  };
}
