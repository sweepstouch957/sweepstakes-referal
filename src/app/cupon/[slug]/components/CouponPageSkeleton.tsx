"use client";

import { Box, Typography, Skeleton } from "@mui/material";

export function CouponPageSkeleton() {
  return (
    <Box>
      {/* Breadcrumbs skeleton */}
      <Skeleton width={220} height={24} sx={{ mb: 3 }} />

      {/* Store header skeleton */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: 4,
          border: "1px solid #ffe4f0",
          p: { xs: 3, sm: 4 },
          mb: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Skeleton variant="circular" width={96} height={96} />
        <Skeleton width={200} height={36} />
        <Skeleton width={260} height={22} />
      </Box>

      {/* Coupon banner skeleton */}
      <Skeleton
        variant="rectangular"
        height={220}
        sx={{ borderRadius: 4, mb: 3 }}
      />

      {/* Form skeleton */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: 4,
          border: "1px solid #ffe4f0",
          p: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Skeleton width={180} height={32} />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={54}
            sx={{ borderRadius: 2 }}
          />
        ))}
        <Skeleton
          variant="rectangular"
          height={48}
          sx={{ borderRadius: 24, mt: 1 }}
        />
      </Box>

      <Typography
        variant="caption"
        sx={{ display: "block", textAlign: "center", color: "#d1d5db", mt: 2 }}
      >
        Cargando...
      </Typography>
    </Box>
  );
}
