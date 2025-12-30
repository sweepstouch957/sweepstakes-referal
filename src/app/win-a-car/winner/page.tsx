import { Suspense } from "react";
import { Container, Skeleton } from "@mui/material";
import WinnerTombola from "@/components/tombola/WinnerTombola";
import "./styles.css";
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
        <WinnerTombola
          sweepstakeId={process.env.NEXT_PUBLIC_SWEEPSTAKE_ID || ""}
        />
      </Suspense>
    </>
  );
}
