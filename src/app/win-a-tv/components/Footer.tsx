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

export default function Footer() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ backgroundColor: "#ff4b9b", color: "#fff", pt: 4, pb: 3 }}>
      <Container maxWidth="lg">
        <Stack
          direction={isSmall ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          textAlign={isSmall ? "center" : "left"}
        >
          <Box>
            <Typography variant="body1">📧 info@sweepstouch.com</Typography>
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

        <Box mt={3} textAlign="center">
          <Typography variant="caption" color="white">
            © {new Date().getFullYear()} Sweepstouch. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
