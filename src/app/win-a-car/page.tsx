"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WinACarForm from "./components/WinACarForm";
import Footer from "./components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getStoreBySlug } from "@/services/store.service";
import { Suspense } from "react";
import { Container, Skeleton } from "@mui/material";
import Cookies from "js-cookie";
function WinACarFormContainer() {
  const searchParams = useSearchParams();
  const token = searchParams.get("referralcode") || "";
  const slug = searchParams.get("slug") || "";

  const { data: store, isLoading } = useQuery({
    queryKey: ["store", slug],
    queryFn: () => getStoreBySlug(slug),
    enabled: !!slug,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });

  // setStoreId in local storage
  if (store) {
    Cookies.set("storeId", store._id);
  }

  const showExtendedFields = !!slug;

  return (
    <WinACarForm
      showExtendedFields={showExtendedFields}
      tokenValue={token}
      storeName={store?.name || ""}
      isLoading={isLoading}
      storeId={store?._id || Cookies.get("storeId") || ""}
      sweepstakeId={(process.env.NEXT_PUBLIC_SWEEPSTAKE_ID || "").toString()}
      campaignId={(process.env.NEXT_PUBLIC_CAMPAIGN_ID || "").toString()}
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
