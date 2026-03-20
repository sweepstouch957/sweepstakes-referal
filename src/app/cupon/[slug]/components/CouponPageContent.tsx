"use client";

import { Box } from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  registerWelcomeCoupon,
  RegisterWelcomePayload,
  RegisterWelcomeResponse,
  WelcomeCouponPageData,
} from "@/services/welcomeCoupon.service";

import { CouponBreadcrumbs } from "./CouponBreadcrumbs";
import { StoreHeader } from "./StoreHeader";
import { WelcomeCouponBanner } from "./WelcomeCouponBanner";
import { WelcomeRegistrationForm } from "./WelcomeRegistrationForm";
import { CouponSuccessModal } from "./CouponSuccessModal";

// ────────────────────────────────────────────────────────────────────────────

interface CouponPageContentProps {
  store: WelcomeCouponPageData["store"];
  coupon: WelcomeCouponPageData["coupon"];
  slug: string;
}

// ────────────────────────────────────────────────────────────────────────────

export function CouponPageContent({
  store,
  coupon,
  slug,
}: CouponPageContentProps) {
  const searchParams = useSearchParams();
  const defaultReferralCode = searchParams?.get("referralcode") || "";

  const [modalOpen, setModalOpen] = useState(false);
  const [result, setResult] = useState<RegisterWelcomeResponse | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  const mutation = useMutation<
    RegisterWelcomeResponse,
    { error?: string },
    RegisterWelcomePayload
  >({
    mutationFn: registerWelcomeCoupon,
    onSuccess: (data) => {
      setBackendError(null);
      setResult(data);
      setModalOpen(true);
    },
    onError: (err) => {
      // Surface friendly error to the form for the user — don't open the modal
      setBackendError(
        err?.error || "Ocurrió un error al procesar tu registro. Intenta de nuevo."
      );
    },
  });

  const handleSubmit = (payload: RegisterWelcomePayload) => {
    setBackendError(null);
    mutation.mutate({
      ...payload,
      storeId: store._id,
    });
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <CouponBreadcrumbs storeName={store.name} />

      {/* Store header */}
      <StoreHeader
        name={store.name}
        address={store.address}
        image={store.image}
      />

      {/* Welcome coupon banner */}
      <WelcomeCouponBanner
        title={coupon.title}
        welcomeMessage={coupon.welcomeMessage}
        welcomeImageUrl={coupon.welcomeImageUrl}
        discountPercentage={coupon.discountPercentage}
        validFrom={coupon.validFrom}
        validUntil={coupon.validUntil}
        minPurchaseAmount={coupon.minPurchaseAmount}
        terms={coupon.terms}
      />

      {/* Registration form */}
      <WelcomeRegistrationForm
        storeId={store._id}
        isLoading={mutation.isPending}
        backendError={backendError}
        defaultReferralCode={defaultReferralCode}
        onSubmit={handleSubmit}
        onClearError={() => setBackendError(null)}
      />

      {/* Success modal */}
      <CouponSuccessModal
        open={modalOpen}
        result={result}
        storeName={store.name}
        welcomeImageUrl={coupon.welcomeImageUrl}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
}
