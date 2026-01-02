"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Skeleton } from "@mui/material";
import WinnerTombola from "@/components/tombola/WinnerTombola";
import "./styles.css";

function DrawContainer() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";

  return (
    <>
      {/* Se captura el slug para uso futuro (por ahora no se utiliza). */}
      <span data-captured-slug={slug} style={{ display: "none" }} />

      <WinnerTombola sweepstakeId={process.env.NEXT_PUBLIC_SWEEPSTAKE_ID || ""} />
    </>
  );
}

export default function Page() {
  return (
    <>
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
        <DrawContainer />
      </Suspense>
    </>
  );
}
