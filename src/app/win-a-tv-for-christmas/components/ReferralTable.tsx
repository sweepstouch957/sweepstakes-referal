"use client";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Snackbar,
  useTheme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import StoreIcon from "@mui/icons-material/Store";
import { useState } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { generateReferralCopy } from "@/utils/formatText";
import { FacebookOutlined, Instagram } from "@mui/icons-material";

interface ReferralLinkItem {
  sweepstakeId: string;
  text: string;
  storeId: string;
  _id?: string;
}

interface ReferralLinksTableProps {
  links: ReferralLinkItem[];
  storeName: string;
  onCopy?: (msg: string) => void;
}

export default function ReferralLinksTable({
  links,
  onCopy,
  storeName,
}: ReferralLinksTableProps) {
  const [copiedMsg, setCopiedMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    const msg = `${label} copiado`;
    setCopiedMsg(msg);
    setSnackbarOpen(true);
    if (onCopy) onCopy(msg);
  };

  const share = (platform: string, link: string, storeName: string) => {
    const text = generateReferralCopy(storeName, link);
    const encodedText = encodeURIComponent(text);

    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        link
      )}`,
      instagram: `https://www.instagram.com`,
    };

    window.open(urls[platform], "_blank");
  };

  return (
    <Box>
      <Divider sx={{ my: 4 }}>
        <Chip
          label="Tus Links de Referidos por tienda"
          color="secondary"
          sx={{ fontWeight: 700, letterSpacing: 0.5, fontSize: 15 }}
        />
      </Divider>
      <Stack spacing={3}>
        {links.map((link, idx) => (
          <Paper
            key={idx}
            elevation={5}
            sx={{
              px: 2,
              py: 2,
              borderRadius: 3,
              border: `1.5px solid ${theme.palette.secondary.main}`,
              background: `linear-gradient(90deg, ${theme.palette.background.paper} 65%, ${theme.palette.secondary.light} 100%)`,
              boxShadow: "0 8px 32px #c6282822",
              minWidth: 330,
              maxWidth: 700,
              mx: "auto",
              transition: "0.3s",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box flex={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <StoreIcon
                    sx={{ color: theme.palette.secondary.main, fontSize: 32 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      fontSize: { xs: 16, md: 19 },
                    }}
                  >
                    Copia tu link de referido en tus redes para tener mas oportunidades de ganar
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  mt={1}
                  sx={{
                    maxWidth: "100%",
                  }}
                >
                  <Tooltip title={link.text} arrow>
                    <Chip
                      label={link.text}
                      variant="outlined"
                      color="info"
                      sx={{
                        fontSize: 13,
                        px: 1,
                        width: { xs: 180, md: 380 },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontFamily: "monospace",
                        bgcolor: "#fff",
                        borderWidth: 1,
                        borderStyle: "dashed",
                      }}
                      clickable
                      component="a"
                      href={link.text}
                      target="_blank"
                    />
                  </Tooltip>
                  <Tooltip title="Copiar link" arrow>
                    <IconButton
                      onClick={() => copy(link.text, "Link")}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.secondary.light,
                        ml: 0.5,
                        "&:hover": {
                          bgcolor: theme.palette.secondary.main,
                          color: "#fff",
                        },
                        transition: "0.15s",
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="flex-start"
                    alignItems="center"
                    mt={2}
                  >
                    {/* WhatsApp */}
                    <Tooltip title="Compartir por WhatsApp" arrow>
                      <IconButton
                        onClick={() => share("whatsapp", link.text, storeName)}
                        sx={{
                          bgcolor: "#25D366",
                          color: "#fff",
                          boxShadow: "0 4px 12px #25D36644",
                          width: 30,
                          height: 30,
                          transition: "all 0.18s cubic-bezier(.4,2,.6,1)",
                          ":hover": {
                            bgcolor: "#1EBEA5",
                            transform: "scale(1.12)",
                            boxShadow: "0 6px 16px #25D36666",
                          },
                        }}
                        size="large"
                      >
                        <WhatsAppIcon sx={{ fontSize: 26 }} />
                      </IconButton>
                    </Tooltip>
                    {/* Facebook */}
                    <Tooltip title="Compartir en Facebook" arrow>
                      <IconButton
                        onClick={() => share("facebook", link.text, storeName)}
                        sx={{
                          bgcolor: "#3b5998",
                          color: "#fff",
                          boxShadow: "0 4px 12px #3b599844",
                          width: 30,
                          height: 30,
                          transition: "all 0.18s cubic-bezier(.4,2,.6,1)",
                          ":hover": {
                            bgcolor: "#330b81",
                            transform: "scale(1.12)",
                            boxShadow: "0 6px 16px #3b599866",
                          },
                        }}
                        size="large"
                      >
                        <FacebookOutlined sx={{ fontSize: 26 }} />
                      </IconButton>
                    </Tooltip>
                    {/* Instagram */}
                    <Tooltip title="Ir a Instagram" arrow>
                      <IconButton
                        onClick={() => share("instagram", link.text, storeName)}
                        sx={{
                          background:
                            "radial-gradient(circle at 35% 110%, #FDCB52 0%, #E1306C 60%, #B12257 100%)",
                          color: "#fff",
                          boxShadow: "0 4px 12px #E1306C44",
                          width: 30,
                          height: 30,
                          transition: "all 0.18s cubic-bezier(.4,2,.6,1)",
                          ":hover": {
                            background:
                              "radial-gradient(circle at 60% 20%, #FDCB52 0%, #E1306C 60%, #B12257 100%)",
                            transform: "scale(1.12)",
                            boxShadow: "0 6px 16px #E1306C66",
                          },
                        }}
                        size="large"
                      >
                        <Instagram sx={{ fontSize: 26 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={copiedMsg}
        autoHideDuration={1800}
      />
    </Box>
  );
}
