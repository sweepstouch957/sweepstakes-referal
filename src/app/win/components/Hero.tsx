"use client";

import { Box } from "@mui/material";

export default function Hero() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: 220, md: 360 },
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid #f3f3f3",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          height: { xs: 180, md: 300 },
          mx: "auto",
          border: "2px dashed #ffd1e5",
          borderRadius: 4,
          background: "linear-gradient(180deg, #fff 0%, #fff8fc 100%)",
        }}
      />
    </Box>
  );
}
