"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getWelcomeCouponPageBySlug } from "@/services/welcomeCoupon.service";
import Navbar from "@/app/win-a-car/components/Navbar";
import Footer from "@/app/win-a-car/components/Footer";
import { Box, Container, Skeleton } from "@mui/material";
import { CouponPageContent } from "./components/CouponPageContent";
import { CouponPageError } from "./components/CouponPageError";
import { CouponPageSkeleton } from "./components/CouponPageSkeleton";
import { useTranslation } from "react-i18next";

// ─── Page Shell ─────────────────────────────────────────────────────────────
function CouponPageInner() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const { t } = useTranslation();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["welcome-coupon-page", slug],
    queryFn: () => getWelcomeCouponPageBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #fff5f9 0%, #fff0f6 50%, #fff 100%)",
      }}
    >
      <Navbar hideActions />

      {/* Spacer for fixed navbar */}
      <Box sx={{ height: { xs: 64, sm: 72 } }} />

      <Box component="main" sx={{ flex: 1, py: { xs: 3, sm: 5 } }}>
        <Container maxWidth="md">
          {isLoading ? (
            <CouponPageSkeleton />
          ) : isError || !data ? (
            <CouponPageError
              error={
                (error as { error?: string })?.error ||
                t("welcomeCoupon.errors.noActiveCoupon")
              }
            />
          ) : (
            <CouponPageContent
              store={data.store}
              coupon={data.coupon}
              slug={slug}
            />
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

// ─── Default Export with Suspense ────────────────────────────────────────────
export default function CouponSlugPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: "100vh", bgcolor: "#fff8fc" }}>
          <Navbar hideActions />
          <Box sx={{ height: 72 }} />
          <Container maxWidth="md" sx={{ py: 5 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={i === 1 ? 200 : 80}
                sx={{ borderRadius: 3, mb: 2 }}
              />
            ))}
          </Container>
        </Box>
      }
    >
      <CouponPageInner />
    </Suspense>
  );
}
