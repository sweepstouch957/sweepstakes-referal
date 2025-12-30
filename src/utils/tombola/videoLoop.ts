export type LoopConfig = {
  start: number; // LOOP_START
  end: number;   // LOOP_END
};

export function attachSegmentLoop(
  video: HTMLVideoElement,
  cfg: LoopConfig,
  loopActiveRef: React.MutableRefObject<boolean>,
  onTimeUpdateRef: React.MutableRefObject<((this: HTMLVideoElement, ev: Event) => any) | null>
) {
  const handler = () => {
    if (loopActiveRef.current && video.currentTime >= cfg.end) {
      video.currentTime = cfg.start + 0.001;
    }
  };

  onTimeUpdateRef.current = handler;
  video.addEventListener("timeupdate", handler);
}

export function detachSegmentLoop(
  video: HTMLVideoElement,
  onTimeUpdateRef: React.MutableRefObject<((this: HTMLVideoElement, ev: Event) => any) | null>
) {
  const handler = onTimeUpdateRef.current;
  if (handler) video.removeEventListener("timeupdate", handler);
  onTimeUpdateRef.current = null;
}

export function jumpToEndIfInsideLoop(video: HTMLVideoElement, cfg: LoopConfig) {
  if (video.currentTime >= cfg.start && video.currentTime < cfg.end) {
    video.currentTime = cfg.end;
  }
}
