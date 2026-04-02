import { Box, Checkbox, FormControlLabel, Skeleton, TextField, Typography } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import { FormData } from "@/hooks/useReferralStepper";
import { useTranslation } from "react-i18next";

const fieldSx = {
  "& .MuiInputLabel-root": {
    fontSize: "0.98rem",
    fontWeight: 700,
    color: "#374151",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "#f9fafb",
    "& fieldset": {
      borderColor: "#d7dbe3",
    },
    "&:hover fieldset": {
      borderColor: "#c9ced8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#d0d5dd",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "1rem",
    color: "#111827",
    py: 1.35,
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#8b9099",
    opacity: 1,
  },
  "& .MuiFormHelperText-root": {
    mx: 0.25,
  },
};

export default function PersonalInfoStep({
  form,
  isLoading = false,
}: {
  form: UseFormReturn<FormData>;
  isLoading?: boolean;
}) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const { t } = useTranslation();

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{0,4})$/);
    return match
      ? `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`
      : cleaned;
  };

  const phoneValue = watch("phone") || "";
  const [smsConsentChecked, setSmsConsentChecked] = useState(false);

  useEffect(() => {
    if (phoneValue.replace(/\D/g, "").length > 0) {
      setSmsConsentChecked(true);
    }
  }, [phoneValue]);

  const skeletonField = <Skeleton height={62} variant="rounded" sx={{ borderRadius: 3 }} />;

  return (
    <>
      {isLoading ? (
        skeletonField
      ) : (
        <TextField
          {...register("firstName")}
          label={t("form.firstName")}

          InputLabelProps={{ shrink: true }}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          fullWidth
          sx={fieldSx}
        />
      )}
      {isLoading ? (
        skeletonField
      ) : (
        <TextField
          {...register("lastName")}
          label={t("form.lastName")}

          InputLabelProps={{ shrink: true }}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          fullWidth
          sx={fieldSx}
        />
      )}
      {isLoading ? (
        skeletonField
      ) : (
        <TextField
          {...register("phone")}
          label={t("form.phone")}

          InputLabelProps={{ shrink: true }}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          fullWidth
          sx={fieldSx}
          onChange={(e) => setValue("phone", formatPhone(e.target.value))}
        />
      )}
      {isLoading ? (
        <Skeleton height={34} width="70%" sx={{ borderRadius: 2, mt: -1, mb: 0.25 }} />
      ) : (
        <FormControlLabel
          control={
            <Checkbox
              checked={smsConsentChecked}
              onChange={(e) => setSmsConsentChecked(e.target.checked)}
              sx={{
                color: "#ff1493",
                "&.Mui-checked": {
                  color: "#ff1493",
                },
                py: 0.5,
              }}
            />
          }
          label={t("form.smsConsent")}
          sx={{
            alignSelf: "flex-start",
            mt: -1,
            mb: -0.25,
            ml: 0.25,
            "& .MuiFormControlLabel-label": {
              fontSize: "0.95rem",
              color: "#374151",
              fontWeight: 500,
            },
          }}
        />
      )}
      {isLoading ? (
        <Skeleton height={58} sx={{ borderRadius: 2, mt: -0.5, mb: 0.5 }} />
      ) : (
        <Typography
          sx={{
            fontSize: "0.74rem",
            lineHeight: 1.45,
            color: "#98a2b3",
            mt: -0.25,
            mb: 0.75,
          }}
        >
          {t("form.smsConsentDisclaimer")}
        </Typography>
      )}
      {isLoading ? (
        skeletonField
      ) : (
        <TextField
          {...register("email")}
          label={t("form.email")}

          InputLabelProps={{ shrink: true }}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          sx={fieldSx}
        />
      )}
      {isLoading ? (
        skeletonField
      ) : (
        <TextField
          {...register("zip")}
          label={t("form.zip")}

          InputLabelProps={{ shrink: true }}
          error={!!errors.zip}
          helperText={errors.zip?.message}
          fullWidth
          sx={fieldSx}
          onChange={(e) =>
            setValue("zip", e.target.value.replace(/\D/g, "").slice(0, 5))
          }
        />
      )}
    </>
  );
}
