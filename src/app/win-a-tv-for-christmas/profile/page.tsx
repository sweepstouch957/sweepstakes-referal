/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Box, Container, Paper, Alert, Skeleton, Fade } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import {
  getReferralInfoByStore,
  ReferralInfoResponse,
} from "@/services/sweeptake.service";
import ProfileContent from "./componetns/Profile";

export default function WinACarLoginPage() {
  const [profileData, setProfileData] = useState<any | null>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(true);

  // 1. Cargar perfil y tiendas solo cuando la página se hidrata.
  useEffect(() => {
    const user = Cookies.get("sweepstakes_user");
    const stores = Cookies.get("sweepstakes_stores");
    const userInfo: any = {};
    if (user) userInfo.user = JSON.parse(user);
    if (stores) userInfo.stores = JSON.parse(stores);
    setProfileData(userInfo);
    if (stores) {
      const storeList = JSON.parse(stores);
      if (storeList.length > 0) setSelectedStore(storeList[0].slug);
    }
    setTimeout(() => setInitLoading(false), 450); // Delay para simular carga real, UX más suave
  }, []);

  const token = Cookies.get("sweepstakes_token");

  // 2. Query solo si ya está todo montado y hay tienda seleccionada.
  const { data, isLoading, isError, error, isFetching } =
    useQuery<ReferralInfoResponse>({
      queryKey: ["referralInfo", selectedStore, token],
      queryFn: () => getReferralInfoByStore(selectedStore!, token!),
      enabled: !!selectedStore && !!token && !initLoading,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 2,
    });

  // 3. Cambiar tienda (ahora usa el handler esperado)
  const handleChangeStore = (slug: string) => {
    setSelectedStore(slug);
    Cookies.set("sweepstakes_last_store", slug, { path: "/" });
  };

  // 4. Chequear si hay tiendas
  const noStores =
    !profileData?.stores ||
    !Array.isArray(profileData.stores) ||
    profileData.stores.length === 0;

  // 5. Skeletons bellos para UX (full skeleton de la card)
  const SkeletonCard = () => (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, sm: 4 },
        borderRadius: 4,
        bgcolor: "#eeeeee",
        minHeight: 470,
        textAlign: "center",
        boxShadow: "0 2px 32px #c6282814",
      }}
    >
      <Skeleton
        variant="text"
        sx={{ mx: "auto", width: "70%", height: 46, bgcolor: "#251a2d" }}
      />
      <Skeleton
        variant="rectangular"
        sx={{
          my: 2,
          mx: "auto",
          width: "100%",
          height: 38,
          borderRadius: 2,
          bgcolor: "#eeeeee",
        }}
      />
      <Skeleton
        variant="rectangular"
        sx={{
          my: 2,
          mx: "auto",
          width: "95%",
          height: 48,
          borderRadius: 2,
          bgcolor: "#eeeeee",
        }}
      />
      <Skeleton
        variant="rectangular"
        sx={{
          my: 2,
          mx: "auto",
          width: "100%",
          height: 64,
          borderRadius: 3,
          bgcolor: "#eeeeee",
        }}
      />
      <Skeleton
        variant="rectangular"
        sx={{
          my: 2,
          mx: "auto",
          width: "90%",
          height: 28,
          borderRadius: 2,
          bgcolor: "#eeeeee",
        }}
      />
      <Skeleton
        variant="rectangular"
        sx={{
          my: 2,
          mx: "auto",
          width: "85%",
          height: 28,
          borderRadius: 2,
          bgcolor: "#eeeeee",
        }}
      />
      <Skeleton
        variant="rectangular"
        sx={{
          my: 2,
          mx: "auto",
          width: "99%",
          height: 44,
          borderRadius: 2,
          bgcolor: "#eeeeee",
        }}
      />
    </Paper>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: { xs: 3, md: 6 },
        }}
      >
        <Container maxWidth="md" sx={{ my: 6 }}>
          <Fade in={initLoading || isLoading || isFetching}>
            <Box>
              {(initLoading || isLoading || isFetching) && <SkeletonCard />}
            </Box>
          </Fade>
          {/* Mostrar solo si no hay loading ni error */}
          {!initLoading && !isLoading && !isFetching && !isError && (
            <Paper
              elevation={4}
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 4,
                textAlign: "center",
                bgcolor:"#fdf6fb",
                boxShadow: "0 3px 32px #c6282818",
              }}
            >
              {noStores ? (
                <Alert severity="warning" sx={{ mb: 2, fontWeight: 600 }}>
                  No tienes tiendas activas. ¡Participa primero en una campaña!
                </Alert>
              ) : (
                <ProfileContent
                  storeName={data?.storeName || ""}
                  referralLinks={data?.referralLinks || []}
                  registeredPhones={data?.registeredPhones || []}
                  userCoupons={data?.userCoupons || []}
                  stores={profileData?.stores || []}
                  selectedStore={selectedStore}
                  handleChangeStore={(e: any) =>
                    handleChangeStore(e.target ? e.target.value : e)
                  }
                />
              )}
            </Paper>
          )}
          {/* Overlay error */}
          {!initLoading && isError && (
            <Fade in={true}>
              <Box
                sx={{
                  mt: 2,
                  minHeight: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Alert severity="error" sx={{ fontWeight: 700 }}>
                  {error instanceof Error
                    ? error.message
                    : "Error al cargar datos"}
                </Alert>
              </Box>
            </Fade>
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
