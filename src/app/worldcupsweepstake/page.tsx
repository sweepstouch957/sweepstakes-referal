"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Container, Skeleton } from "@mui/material";
import Cookies from "js-cookie";

import Navbar from "../win-a-car/components/Navbar";
import Footer from "../win-a-car/components/Footer";

import Hero from "./components/Hero";
import SoccerPreloader from "./components/SoccerPreloader";
import CustomCursor from "./components/CustomCursor";
import BackToTop from "./components/BackToTop";
import WinACarForm from "./components/WinACarForm";

import { getStoreBySlug } from "@/services/store.service";

function WorldCupFormContainer() {
  const searchParams = useSearchParams();
  const token = searchParams.get("referralcode") || "";
  const slug = searchParams.get("slug") || "";

  useEffect(() => {
    if (searchParams.get("scrollTo") === "form") {
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
    enabled: !!slug,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });

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
      slug={slug}
      storeId={store?._id || Cookies.get("storeId") || ""}
      sweepstakeId={(process.env.NEXT_PUBLIC_SWEEPSTAKE_ID_WORLDCUP || "").toString()}
      campaignId={(process.env.NEXT_PUBLIC_CAMPAIGN_ID || "").toString()}
    />
  );
}

export default function WorldCupSweepstakePage() {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <>
      {!loaderDone && (
        <SoccerPreloader
          duration={3000}
          bg="#ffffff"
          audioSrc="/audio/preloader.mp3"
          onDone={() => setLoaderDone(true)}
        />
      )}

      <CustomCursor />
      <BackToTop />

      <Navbar hideActions hideMobileMenu />

      <main>
        <Hero start={loaderDone} />

        <section
          id="contact"
          className="min-h-[50vh] bg-slate-50 flex items-center justify-center py-20"
        >
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
            <WorldCupFormContainer />
          </Suspense>
        </section>
      </main>

      <Footer />
    </>
  );
}
