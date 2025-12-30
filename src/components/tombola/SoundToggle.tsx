"use client";

import { Box, IconButton } from "@mui/material";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";

export function SoundToggle({
  soundOn,
  onToggle,
}: {
  soundOn: boolean;
  onToggle: () => void;
}) {
  return (
    <Box sx={{ position: "absolute", top: 10, right: 10, zIndex: 5 }}>
      <IconButton
        onClick={onToggle}
        sx={{
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,.14)",
          bgcolor: "rgba(0,0,0,.22)",
          backdropFilter: "blur(10px)",
          "&:hover": { bgcolor: "rgba(0,0,0,.35)" },
        }}
      >
        {soundOn ? (
          <VolumeUpRoundedIcon sx={{ color: "white" }} />
        ) : (
          <VolumeOffRoundedIcon sx={{ color: "white" }} />
        )}
      </IconButton>
    </Box>
  );
}
