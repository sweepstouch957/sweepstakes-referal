/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Alert,
  Typography,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileContent from "./componetns/Profile";
import Cookies from "js-cookie";

export default function WinACarLoginPage() {
  const [profileData, setProfileData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const raw = Cookies.get("sweepstouch_user_profile");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setProfileData(parsed);
      } catch (_) {
        Cookies.set("sweepstouch_user_profile","");
        setHasError(true);
      }
    } else {
      setHasError(true);
    }
    setLoading(false);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#18181B",
      }}
    >
      <Navbar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <Container
            maxWidth="sm"
            sx={{
              my: 6,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress  sx={{width:40,height:40}}/>
          </Container>
        ) : hasError ? (
          <Container maxWidth="sm" sx={{ textAlign: "center", mt: 6 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Error loading profile data. Please try logging in again.
            </Alert>
            <Typography variant="body1" color="white">
              We could not load your profile. If the problem persists, contact
              support.
            </Typography>
          </Container>
        ) : (
          <Box mt={{ xs: 4, sm: 6, md: 8 }}>
            <ProfileContent {...profileData} />
          </Box>
        )}
      </Box>

      <Footer />
    </Box>
  );
}
