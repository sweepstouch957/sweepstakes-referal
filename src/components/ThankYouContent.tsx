"use client";

import {
  Container,
  Typography,
  Box,
  Stack,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  Snackbar,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Image from "next/image";
import ParticipationImage from "@public/referral-illustration.webp";
import { useState } from "react";


interface ThankYouProps {
  referralCode: string;
  referralLink: string;
  supermarket: string;
  userCoupons: Array<{
    code: string;
    method: string;
  }>;
}

export default function ThankYouContent({
  referralCode,
  referralLink,
  supermarket,
  userCoupons,
}: ThankYouProps) {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setSnackbarOpen(true);
    
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 2000);
  };

  const share = (platform: string) => {
    const text = `¡Regístrate con mi código y gana más oportunidades de participar! Código: ${referralCode} 👉 ${referralLink}`;
    const encodedText = encodeURIComponent(text);

    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        referralLink
      )}`,
      instagram: `https://www.instagram.com`,
      link: referralLink,
    };

    if (platform === "link") {
      navigator.clipboard.writeText(referralLink);
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
    } else {
      window.open(urls[platform], "_blank");
    }
  };


  return (
    <>
      <Box sx={{ bgcolor: "#fff", pb: 6 }}>
        <Container maxWidth="sm">
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 4,
              mt: 12,
              boxShadow: 3,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ color: "#ff4b9b" }} fontWeight={700}>
              Thank you for participating!
            </Typography>
            <Typography variant="body1" mt={1}>
              Your registration with <b>{supermarket}</b> was successful!
            </Typography>

            <Typography variant="body1" mt={4}>
              Your referral code is:
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                background: "#f1f1f1",
                borderRadius: 2,
                py: 1,
                my: 1,
                px: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                color="#000"
                sx={{ userSelect: "text" }}
              >
                {referralCode}
              </Typography>
              <Tooltip title="Copiar código">
                <IconButton size="small" onClick={copyReferralCode}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography variant="subtitle1" fontWeight={700} mt={4}>
              Share it with your friends and increase your chances of winning:
            </Typography>
            <Typography variant="body2" mt={1}>
              • For each friend who completes their registration with your code,
              you’ll get 1 additional entry.
            </Typography>
            <Typography variant="body2">
              • The more referrals, the closer you are to the wheel!
            </Typography>

            <Box my={2}>
              <Image
                src={ParticipationImage.src}
                alt="Thank You"
                width={422}
                height={445}
                style={{
                  borderRadius: "8px",
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }}>
              <Chip label="Your Coupons" color="primary" />
            </Divider>

            <Stack spacing={1}>
              {userCoupons.length > 0 ? (
                userCoupons.map((coupon, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      backgroundColor: "#f7f7f7",
                      borderRadius: 2,
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" fontWeight={700}>
                      {coupon.code}
                    </Typography>
                    <Chip label={coupon.method} size="small" />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No coupons found.
                </Typography>
              )}
            </Stack>

            <Typography variant="subtitle1" fontWeight={700} mt={4}>
              How to share?
            </Typography>
            <Typography variant="body2" mt={1}>
              • Copy your unique link and send it via WhatsApp
            </Typography>
            <Typography variant="body2">
              • Share on Facebook, Instagram, or email
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
              <IconButton
                onClick={() => share("whatsapp")}
                sx={{
                  bgcolor: "#25D366",
                  color: "#fff",
                  ":hover": { bgcolor: "#25D366" },
                }}
              >
                <WhatsAppIcon />
              </IconButton>
              <IconButton
                onClick={() => share("facebook")}
                sx={{
                  bgcolor: "#3b5998",
                  color: "#fff",
                  ":hover": { bgcolor: "#3b5998" },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                onClick={() => share("instagram")}
                sx={{
                  bgcolor: "#E1306C",
                  color: "#fff",
                  ":hover": { bgcolor: "#E1306C" },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                onClick={() => share("link")}
                sx={{
                  bgcolor: "#000",
                  color: "#fff",
                  ":hover": { bgcolor: "#000" },
                }}
              >
                <LinkIcon />
              </IconButton>
            </Stack>

            <Typography
              variant="body1"
              mt={4}
              sx={{ color: "#ff4b9b", fontWeight: 700 }}
            >
              Good luck and thanks for being part of Sweepstouch!
            </Typography>
          </Box>
        </Container>
      </Box>
      <Snackbar 
        open={snackbarOpen}
        onClose={() => {}}
        color="success"
        message="Link copied to clipboard"
      />
    </>
  );
}
