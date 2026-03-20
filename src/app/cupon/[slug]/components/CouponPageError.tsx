"use client";

import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface CouponPageErrorProps {
  error: string;
}

export function CouponPageError({ error }: CouponPageErrorProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #fff0f6 0%, #fff5f9 100%)",
          border: "1.5px solid #fda4cf",
          borderRadius: 5,
          p: { xs: 4, sm: 6 },
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2.5,
          boxShadow: "0 8px 40px rgba(255, 75, 155, 0.08)",
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ffe4f0 0%, #ffd0e8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 40, color: "#ff4b9b" }} />
        </Box>

        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            background: "linear-gradient(90deg, #d7006e, #ff4b9b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          {t("welcomeCoupon.errors.pageUnavailable")}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "#6b7280", maxWidth: 420, lineHeight: 1.65, fontSize: 16 }}
        >
          {error}
        </Typography>

        <Button
          href="/"
          variant="contained"
          sx={{
            mt: 1,
            background: "linear-gradient(90deg, #d7006e, #ff4b9b)",
            borderRadius: 24,
            px: 4,
            py: 1.25,
            fontWeight: 700,
            textTransform: "none",
            fontSize: 15,
            boxShadow: "0 4px 20px rgba(215, 0, 110, 0.3)",
            "&:hover": {
              background: "linear-gradient(90deg, #b8005c, #e93d89)",
              boxShadow: "0 6px 24px rgba(215, 0, 110, 0.4)",
            },
          }}
        >
          {t("welcomeCoupon.errors.goHome")}
        </Button>
      </Box>
    </motion.div>
  );
}
