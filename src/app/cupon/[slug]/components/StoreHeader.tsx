import { Box, Typography, Button, Stack } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslation } from "react-i18next";

interface StoreHeaderProps {
  name: string;
  address?: string;
  image?: string;
}

export function StoreHeader({ name, address, image }: StoreHeaderProps) {
  const { t } = useTranslation();

  const handleScrollToForm = () => {
    const formElement = document.getElementById("registration-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          background: "#fff",
          borderRadius: 5,
          border: "1.5px solid #ffe4f0",
          p: { xs: 3, sm: 4 },
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: { xs: 2, sm: 3 },
          boxShadow: "0 4px 32px rgba(255, 75, 155, 0.07)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <Box
          sx={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,75,155,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(215,0,110,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Store logo / avatar */}
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: 80, sm: 96 },
            height: { xs: 80, sm: 96 },
            borderRadius: "50%",
            overflow: "hidden",
            background: "linear-gradient(135deg, #ffe4f0, #ffd5e8)",
            border: "3px solid #fff",
            boxShadow: "0 0 0 3px #ffc4de, 0 4px 16px rgba(255,75,155,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {image ? (
            <Image
              src={image}
              alt={`${name} logo`}
              fill
              style={{ objectFit: "contain", padding: 10 }}
            />
          ) : (
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: 32, sm: 40 },
                background: "linear-gradient(135deg, #d7006e, #ff4b9b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Typography>
          )}
        </Box>

        {/* Store info */}
        <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              color: "#1f2937",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {name}
          </Typography>

          {address && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                justifyContent: { xs: "center", sm: "flex-start" },
                mt: 0.5,
              }}
            >
              <LocationOnOutlinedIcon sx={{ fontSize: 16, color: "#ff4b9b" }} />
              <Typography
                variant="body2"
                sx={{ color: "#6b7280", fontWeight: 500 }}
              >
                {address}
              </Typography>
            </Box>
          )}

          {/* Register CTA / Active badge row */}
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={2} 
            alignItems={{ xs: "center", sm: "center" }}
            sx={{ mt: 2 }}
          >
            {/* Active badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                background: "linear-gradient(90deg, #ffe4f0, #ffd5e8)",
                borderRadius: 20,
                px: 2,
                py: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "linear-gradient(90deg, #d7006e, #ff4b9b)",
                  animation: "swpulse 2s ease-in-out infinite",
                  "@keyframes swpulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.35 },
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #d7006e, #ff4b9b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("welcomeCoupon.banner.exclusiveLabel") || "Cupón de Bienvenida Activo"}
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="small"
              onClick={handleScrollToForm}
              endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
              sx={{
                background: "linear-gradient(90deg, #d7006e, #ff4b9b)",
                borderRadius: 2,
                px: 3,
                py: 0.8,
                fontWeight: 900,
                textTransform: "none",
                fontSize: 13,
                boxShadow: "0 8px 20px rgba(215, 0, 110, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 12px 30px rgba(215, 0, 110, 0.3)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              {t("welcomeCoupon.banner.cta") || "Regístrate ahora"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </motion.div>
  );
}
