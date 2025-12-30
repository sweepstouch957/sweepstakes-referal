"use client";

import FancyButton from "@/components/FancyButton";
import { Box, Button } from "@mui/material";
import { motion } from "framer-motion";

export function BannerSection({
  bannerVideoSrc,
  onGoToDraw,
}: {
  bannerVideoSrc: string;
  onGoToDraw: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: "100%" }}
    >
      <Box
        sx={{
          width: "100%",
          borderRadius: { xs: 3, md: 4 },
          overflow: "hidden",
          position: "relative",
          aspectRatio: "16/9",
          boxShadow: "0 18px 60px rgba(0,0,0,.28)",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        >
          <source src={bannerVideoSrc} type="video/mp4" />
        </video>

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            pb: { xs: 2, md: 3 },
            pointerEvents: "none",
            ml: 2,
          }}
        >
          <Box sx={{ pointerEvents: "auto" }}>
            
            <Button onClick={onGoToDraw} size="small" variant="contained" >
              Go to the draw
            </Button>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
