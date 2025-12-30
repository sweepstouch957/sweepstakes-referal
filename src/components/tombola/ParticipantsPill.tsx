"use client";

import { Box, Typography } from "@mui/material";

export function ParticipantsPill({
  isLoading,
  formattedParticipants,
}: {
  isLoading: boolean;
  formattedParticipants: string;
}) {
  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        borderRadius: 999,
        pb: 1.2,
        pt: 1.2,
        border: "1px solid rgba(255,255,255,.16)",
        bgcolor: "rgba(0,0,0,.20)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 23, sm: 38 },
          fontWeight: 700,
          letterSpacing: 0.2,
          lineHeight: "38px",
          color: "black",
        }}
      >
        Total Participants
      </Typography>

      <Typography
        sx={{
          color: "black",
          fontWeight: 950,
          fontSize: { xs: 22, sm: 28, md: 54 },
          lineHeight: { xs: "28px", md: "56px" },
        }}
      >
        {isLoading ? "Loading…" : formattedParticipants}
      </Typography>
    </Box>
  );
}
