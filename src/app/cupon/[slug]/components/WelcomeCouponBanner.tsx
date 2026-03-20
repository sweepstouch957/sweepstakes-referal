import { Box, Typography, Chip, Button, Stack, Tooltip, Divider, Paper, Grid } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useTranslation } from "react-i18next";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ImageViewer, useImageViewer, ViewImageIcon } from "@/components/ImageViewer";

interface WelcomeCouponBannerProps {
  title?: string;
  welcomeMessage?: string;
  welcomeImageUrl?: string;
  discountPercentage?: string;
  validFrom?: string;
  validUntil?: string;
  minPurchaseAmount?: string;
  terms?: string;
}

export function WelcomeCouponBanner({
  title,
  welcomeMessage,
  welcomeImageUrl,
  discountPercentage,
  validFrom,
  validUntil,
  minPurchaseAmount,
  terms,
}: WelcomeCouponBannerProps) {
  const { t } = useTranslation();
  const { isOpen, currentImage, openViewer, closeViewer } = useImageViewer();

  const handleScrollToForm = () => {
    const formElement = document.getElementById("registration-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            mb: 3,
            border: "1px solid rgba(215, 0, 110, 0.12)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
            background: "#fff",
            position: "relative",
            maxWidth: 1000,
            mx: "auto"
          }}
        >
          {/* Main Visual Section */}
          <Grid container={undefined} columns={12}>
            <Grid size={{ xs: 12, md: welcomeImageUrl ? 4 : 12 }}>
              {welcomeImageUrl ? (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 180, md: "100%" },
                    minHeight: { md: 280 },
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => openViewer(welcomeImageUrl)}
                >
                  <Image
                    src={welcomeImageUrl}
                    alt={title || "Welcome Coupon"}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to right, rgba(0,0,0,0.2), transparent)",
                    }}
                  />
                  <Tooltip title={t("welcomeCoupon.banner.viewFull") || "View Full Image"}>
                    <ViewImageIcon
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        openViewer(welcomeImageUrl);
                      }}
                      sx={{ position: "absolute", top: 12, right: 12, zIndex: 5, transform: "scale(0.8)" }}
                    />
                  </Tooltip>
                </Box>
              ) : null}
            </Grid>

            {/* Content Section */}
            <Grid size={{ xs: 12, md: welcomeImageUrl ? 8 : 12 }}>
              <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 }, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Stack spacing={2}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                      <Chip
                        icon={<LocalOfferIcon sx={{ fontSize: 12, color: "#d7006e !important" }} />}
                        label={t("welcomeCoupon.banner.exclusiveLabel") || "LIMITED TIME OFFER"}
                        size="small"
                        sx={{
                          background: "rgba(215, 0, 110, 0.06)",
                          color: "#d7006e",
                          fontWeight: 800,
                          fontSize: 9,
                          height: 20,
                          letterSpacing: 0.5,
                        }}
                      />
                    </Stack>
                    
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 900,
                        color: "#1f2937",
                        fontSize: { xs: 18, sm: 22, md: 24 },
                        lineHeight: 1.2,
                        mb: 0.5,
                      }}
                    >
                      {title || t("welcomeCoupon.banner.defaultTitle") || "OFFICIAL WELCOME DISCOUNT"}
                    </Typography>

                    {discountPercentage && (
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 900,
                          background: "linear-gradient(90deg, #d7006e, #ff4b9b)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontSize: { xs: 32, sm: 40, md: 44 },
                          lineHeight: 1,
                          mb: 1,
                        }}
                      >
                        {discountPercentage} OFF
                      </Typography>
                    )}
                  </Box>

                  {/* Coupon Details Row (More Compact) */}
                  <Stack 
                    direction={{ xs: "column", sm: "row" }} 
                    spacing={2} 
                    divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />}
                  >
                    {(validFrom || validUntil) && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarMonthIcon sx={{ fontSize: 16, color: "#d7006e", opacity: 0.8 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 700, textTransform: "uppercase", fontSize: 9, display: "block", lineHeight: 1 }}>
                            {t("welcomeCoupon.banner.validity") || "Validity"}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#374151", fontSize: 13 }}>
                            {validFrom ? formatDate(validFrom) : "Now"} - {validUntil ? formatDate(validUntil) : "Ongoing"}
                          </Typography>
                        </Box>
                      </Stack>
                    )}

                    {minPurchaseAmount && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ShoppingCartIcon sx={{ fontSize: 16, color: "#d7006e", opacity: 0.8 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 700, textTransform: "uppercase", fontSize: 9, display: "block", lineHeight: 1 }}>
                            {t("welcomeCoupon.banner.minPurchase") || "Min. Purchase"}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#374151", fontSize: 13 }}>
                            {minPurchaseAmount}
                          </Typography>
                        </Box>
                      </Stack>
                    )}
                  </Stack>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems="center"
                    sx={{ mt: 1 }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleScrollToForm}
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                      sx={{
                        background: "linear-gradient(90deg, #d7006e, #ff4b9b)",
                        borderRadius: 2,
                        px: 3,
                        py: 1.2,
                        fontWeight: 900,
                        textTransform: "none",
                        fontSize: 14,
                        boxShadow: "0 8px 20px rgba(215, 0, 110, 0.2)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 12px 30px rgba(215, 0, 110, 0.3)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      {t("welcomeCoupon.banner.cta") || "Get Form"}
                    </Button>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9ca3af",
                        fontWeight: 600,
                        fontSize: 11,
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      {t("welcomeCoupon.banner.fastProcess") || "Less than 30s."}
                    </Typography>
                  </Stack>

                  {terms && (
                    <Box sx={{ pt: 1, display: "flex", gap: 0.5, alignItems: "center" }}>
                      <InfoOutlinedIcon sx={{ fontSize: 12, color: "#9ca3af" }} />
                      <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 500, fontStyle: "italic", fontSize: 10 }}>
                        {terms}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </motion.div>

      <ImageViewer
        open={isOpen}
        imageUrl={currentImage}
        onClose={closeViewer}
      />
    </>
  );
}
