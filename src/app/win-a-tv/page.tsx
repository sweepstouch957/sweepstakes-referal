"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WinACarForm from "./components/WinACarForm";
import Footer from "./components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getStoreBySlug } from "@/services/store.service";
import { Suspense, useEffect } from "react";
import { Container, Skeleton } from "@mui/material";
import Cookies from "js-cookie";
function WinACarFormContainer() {
  const searchParams = useSearchParams();
  const token = searchParams.get("referralcode") || "";
  // For Win-a-TV we want a default store selected even if the URL doesn't include a slug.
  // The user can still override it by providing ?slug=...
  const DEFAULT_STORE_SLUG =
    "key-food-super-fresh-386-fulton-avenue-hempstead-ny-11550-usa";
  const slug = searchParams.get("slug") || DEFAULT_STORE_SLUG;

   useEffect(() => {
    if (searchParams.get("scrollTo") === "form") {
      // Esperar a que el DOM esté listo
      setTimeout(() => {
        const formElement = document.getElementById("form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 250);
    }
  }, [searchParams]);

  const { data: store, isLoading } = useQuery({
    queryKey: ["store", slug],
    queryFn: () => getStoreBySlug(slug),
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });

  // setStoreId in local storage
  if (store) {
    Cookies.set("storeId", store._id);
  }

  // We always have a store (either from query param or default), so this can be enabled.
  const showExtendedFields = true;

  return (
    <WinACarForm
      showExtendedFields={showExtendedFields}
      tokenValue={token}
      // Fallback name so Step 2 always shows a store even while the API request is loading.
      storeName={store?.name || "Key Food Super Fresh"}
      isLoading={isLoading}
      slug={slug}
      storeId={store?._id || Cookies.get("storeId") || ""}
      // Por ahora se guarda en el mismo sweepstake/campaign del carro.
      // Cuando tengas los IDs de la TV, solo define estas variables y automáticamente
      // empezará a registrar en el sweepstake/campaign de la TV.
      sweepstakeId={(
        process.env.NEXT_PUBLIC_SWEEPSTAKE_ID_WIN_A_TV ||
        process.env.NEXT_PUBLIC_SWEEPSTAKE_ID ||
        ""
      ).toString()}
      campaignId={(
        process.env.NEXT_PUBLIC_CAMPAIGN_ID_WIN_A_TV ||
        process.env.NEXT_PUBLIC_CAMPAIGN_ID ||
        ""
      ).toString()}
    />
  );
}

export default function WinACarPage() {
  return (
    <>
      <Navbar />
      <Hero />

      <Suspense
        fallback={
          <Container maxWidth="sm" sx={{ my: 6 }}>
            <Skeleton height={60} sx={{ mb: 2 }} />
            <Skeleton height={60} sx={{ mb: 2 }} />
            <Skeleton height={60} sx={{ mb: 2 }} />
            <Skeleton height={60} sx={{ mb: 2 }} />
            <Skeleton height={60} sx={{ mb: 2 }} />
            <Skeleton height={60} />
          </Container>
        }
      >
        <WinACarFormContainer />
      </Suspense>

      <Footer />
    </>
  );
}
