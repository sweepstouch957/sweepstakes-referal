"use client";

import { createConfetti } from "@/utils/confetti";
import { Box, Container, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef } from "react";
import { useLotteryData } from "@/hooks/useLotteryData";
import { useJackpotSound } from "@/hooks/tombola/useJackpotSound";
import { useTombolaEngine } from "@/hooks/tombola/useTombolaEngine";

import { SpotlightOverlay } from "./SpotlightOverlay";
import { BannerSection } from "./BannerSection";
import { WinnerRevealCard } from "./WinnerRevealCard";
import { TombolaStage } from "./TombolaStage";

type Props = {
  sweepstakeId: string;
  storeId?: string;
  bannerVideoSrc?: string;
  tombolaVideoSrc?: string;
  soundSrc?: string;
};

const LOOP_START = 3.0;
const LOOP_END = 4.5;

export default function WinnerTombola({
  sweepstakeId,
  storeId,
  bannerVideoSrc = "/videos/Ultrapremium_commercial_animation_202512291.mp4",
  tombolaVideoSrc = "/videos/Use_in_english_202512291603_32reh.mp4",
  soundSrc = "/sounds/jackpot.mp3",
}: Props) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const { participantsSample, participantCount, isLoading, isError } =
    useLotteryData(sweepstakeId, storeId);

  const winnerCardRef = useRef<HTMLDivElement>(null);
  const tombolaRef = useRef<HTMLDivElement>(null);

  const sound = useJackpotSound();

  const engine = useTombolaEngine({
    participantsSample,
    participantCount,
    isLoading,
    isError,
    loopConfig: { start: LOOP_START, end: LOOP_END },
  });

  // 🎉 confetti + 🔊 sonido cuando aparece finalWinner
  useEffect(() => {
    if (!engine.finalWinner) return;

    createConfetti({ duration: 9000 });
    sound.play();

    window.requestAnimationFrame(() => {
      winnerCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [engine.finalWinner, sound]);

  const onStart = async () => {
    await sound.unlock();
    await engine.startSpinning();
  };

  const onStop = async () => {
    await sound.unlock();
    await engine.stopSpinningAndReveal();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #123592, #010324)",
        py: { xs: 2.5, md: 4 },
        position: "relative",
      }}
    >
      {/* audio */}
      <audio ref={sound.audioRef} preload="auto" src={soundSrc} />

      <SpotlightOverlay show={engine.winnerSpotlight} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 50 }}>
        <Stack spacing={{ xs: 2, md: 3.5 }} alignItems="center">
          <BannerSection
            bannerVideoSrc={bannerVideoSrc}
            onGoToDraw={() =>
              tombolaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />

          {/* Winner card */}
          <div ref={winnerCardRef} style={{ width: "100%" }}>
            {engine.finalWinner && (
              <WinnerRevealCard
                winner={engine.finalWinner}
                displayPhoneFinal={engine.displayPhoneFinal}
                soundOn={sound.soundOn}
                onToggleSound={() => sound.setSoundOn((v) => !v)}
              />
            )}
          </div>

          {/* Tombola */}
          <div ref={tombolaRef} style={{ width: "100%" }}>
            <TombolaStage
              tombolaVideoSrc={tombolaVideoSrc}
              videoRef={engine.videoRef}
              phase={engine.phase}
              isLoading={isLoading}
              isError={isError}
              formattedParticipants={engine.formattedParticipants}
              currentSpinDisplay={engine.displayPhoneForAnim}
              keyTick={engine.keyTick}
              finalDisplay={engine.finalWinner ? engine.displayPhoneFinal : ""}
              canStart={engine.canStart}
              canStop={engine.canStop}
              onStart={onStart}
              onStop={onStop}
              fullWidthButtons={!mdUp}
            />
          </div>

          <Typography color="white" variant="h4" align="center" fontWeight={800}>
            SweepsTouch {new Date().getFullYear()}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
