"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WinACarForm from "./components/WinACarForm";
import Footer from "./components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getStoreBySlug } from "@/services/store.service";

export default function WinACarPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("refferalcode") || "";
  const slug = searchParams.get("slug") || "";

  const { data: store, isLoading } = useQuery({
    queryKey: ["store", slug],
    queryFn: () => getStoreBySlug(slug),
    enabled: !!slug,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });

  const showExtendedFields = !!slug;

  return (
    <>
      <Navbar />
      <Hero />

      <WinACarForm
        showExtendedFields={showExtendedFields}
        tokenValue={token}
        storeName={store?.name || ""}
        isLoading={isLoading}
        storeId={store?._id || ""}
        sweepstakeId={(process.env.NEXT_PUBLIC_SWEEPSTAKE_ID || "").toString()}
      />

      <Footer />
    </>
  );
}
