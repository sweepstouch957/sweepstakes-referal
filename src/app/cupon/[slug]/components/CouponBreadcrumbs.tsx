"use client";

import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface CouponBreadcrumbsProps {
  storeName?: string;
}

export function CouponBreadcrumbs({ storeName }: CouponBreadcrumbsProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: "#ff4b9b" }} />}
        aria-label="breadcrumb"
      >
        <Link
          href="/"
          underline="hover"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "#d7006e",
            fontWeight: 600,
            fontSize: 14,
            "&:hover": { color: "#ff4b9b" },
          }}
        >
          <HomeIcon sx={{ fontSize: 16 }} />
          Inicio
        </Link>

        <Link
          href="/cupon"
          underline="hover"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "#d7006e",
            fontWeight: 600,
            fontSize: 14,
            "&:hover": { color: "#ff4b9b" },
          }}
        >
          <ConfirmationNumberOutlinedIcon sx={{ fontSize: 16 }} />
          Cupones
        </Link>

        {storeName && (
          <Typography
            sx={{
              color: "#ff4b9b",
              fontWeight: 700,
              fontSize: 14,
              maxWidth: { xs: 150, sm: "none" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {storeName}
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  );
}
