"use client";

import {
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { Facebook, Instagram, LinkedIn } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export default function Footer({ compact = false }: { compact?: boolean }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box component="footer" sx={{
      backgroundColor: compact ? "#E8127F" : "#ff4b9b",
      color: "#fff", pt: compact ? 0.75 : 4, pb: compact ? 0.75 : 3,
      flexShrink: 0,
      ...(compact && {
        "& .MuiIconButton-root": { p: 0.5 },
        "& .MuiSvgIcon-root": { fontSize: 18 },
      }),
    }}>
      <Container maxWidth="lg">
        <Stack
          direction={compact ? "row" : isSmall ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          spacing={compact ? 0.5 : 2}
          textAlign={isSmall ? "center" : "left"}
        >
          <Box>
            <Typography variant="body1" sx={{ fontSize: compact ? 12 : undefined }}>📧 info@sweepstouch.com</Typography>
          </Box>

          <Stack direction="row" spacing={1} justifyContent="center">
            <IconButton
              href="https://facebook.com"
              target="_blank"
              rel="noopener"
              sx={{
                color: "#fff",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.2)" },
              }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              rel="noopener"
              sx={{
                color: "#fff",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.2)" },
              }}
            >
              <Instagram />
            </IconButton>
            <IconButton
              href="https://linkedin.com"
              target="_blank"
              rel="noopener"
              sx={{
                color: "#fff",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.2)" },
              }}
            >
              <LinkedIn />
            </IconButton>
          </Stack>
        </Stack>

        <Box mt={compact ? 0.25 : 3} textAlign="center">
          <Typography variant="caption" color="white" sx={{ fontSize: compact ? 10 : undefined, display: "block", lineHeight: compact ? 1.3 : undefined }}>
            © {new Date().getFullYear()} Sweepstouch. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
