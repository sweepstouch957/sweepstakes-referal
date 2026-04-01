"use client";

import React from "react";
import {
  Box,
  Typography,
  Chip,
  Skeleton,
  Stack,
  Paper,
  Fade,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import { Prize } from "@/services/sweeptake.service";

interface PrizeCardProps {
  prize?: Prize | null;
  isLoading?: boolean;
  mainColor?: string;
  secondaryColor?: string;
}

/**
 * Card premium del premio del sorteo.
 * Muestra imagen, nombre, descripción y valor del premio.
 */
export default function PrizeCard({
  prize,
  isLoading = false,
  mainColor = "#ff4b9b",
  secondaryColor = "#c8104f",
}: PrizeCardProps) {
  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.06)",
          maxWidth: 480,
          mx: "auto",
          width: "100%",
        }}
      >
        <Skeleton variant="rectangular" height={220} />
        <Box sx={{ p: 2.5 }}>
          <Skeleton variant="text" height={32} width="70%" sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} width="90%" />
          <Skeleton variant="text" height={20} width="60%" />
        </Box>
      </Paper>
    );
  }

  if (!prize) return null;

  return (
    <Fade in timeout={600}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: `1.5px solid ${mainColor}22`,
          maxWidth: 480,
          mx: "auto",
          width: "100%",
          background: "#fff",
          boxShadow: `0 8px 40px ${mainColor}18`,
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          "&:hover": {
            boxShadow: `0 16px 60px ${mainColor}30`,
            transform: "translateY(-2px)",
          },
        }}
      >
        {/* Prize image */}
        {prize.image ? (
          <Box
            sx={{
              position: "relative",
              height: { xs: 200, sm: 240 },
              overflow: "hidden",
              background: `linear-gradient(135deg, ${mainColor}10, ${secondaryColor}18)`,
            }}
          >
            <Box
              component="img"
              src={prize.image}
              alt={prize.name}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                p: 2,
                display: "block",
              }}
            />
          </Box>
        ) : (
          /* Fallback trophy when no image */
          <Box
            sx={{
              height: { xs: 160, sm: 200 },
              background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EmojiEventsIcon
              sx={{ fontSize: { xs: 80, sm: 100 }, color: "#fff", opacity: 0.9 }}
            />
          </Box>
        )}

        {/* Prize info */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Badge */}
          <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
            <Chip
              icon={<StarIcon sx={{ fontSize: 14, color: mainColor }} />}
              label="Premio Principal"
              size="small"
              sx={{
                bgcolor: `${mainColor}15`,
                color: mainColor,
                fontWeight: 700,
                fontSize: 11,
                border: `1px solid ${mainColor}30`,
                "& .MuiChip-icon": { ml: 0.5 },
              }}
            />
            {prize.value && (
              <Chip
                label={`$${prize.value.toLocaleString()}`}
                size="small"
                sx={{
                  bgcolor: "#f0fdf4",
                  color: "#16a34a",
                  fontWeight: 700,
                  fontSize: 11,
                  border: "1px solid #bbf7d0",
                }}
              />
            )}
          </Stack>

          {/* Prize name */}
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              color: "#1a1a2e",
              lineHeight: 1.2,
              mb: 0.75,
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
            }}
          >
            {prize.name}
          </Typography>

          {/* Prize description */}
          {prize.description && (
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                lineHeight: 1.55,
                fontSize: { xs: 13, sm: 14 },
              }}
            >
              {prize.description}
            </Typography>
          )}
        </Box>

        {/* Bottom accent bar */}
        <Box
          sx={{
            height: 4,
            background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
          }}
        />
      </Paper>
    </Fade>
  );
}
