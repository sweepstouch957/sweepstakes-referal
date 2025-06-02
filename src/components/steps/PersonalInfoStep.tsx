import { Skeleton, TextField } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/hooks/useReferralStepper";
import { useTranslation } from "react-i18next";

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
  } = form;

  const { t } = useTranslation();

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{0,4})$/);
    return match
      ? `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`
      : cleaned;
  };

  const skeletonField = <Skeleton height={56} variant="rounded" />;

  return (
    <>
      {isLoading ? (
        skeletonField
      ) : (
        <TextField
          {...register("firstName")}
          label={t("form.firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
      )}
      {isLoading ? (
        skeletonField
      ) : (
        <TextField
          {...register("lastName")}
          label={t("form.lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
      )}
      {isLoading ? (
        skeletonField
      ) : (
        <TextField
          {...register("phone")}
          label={t("form.phone")}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          onChange={(e) => setValue("phone", formatPhone(e.target.value))}
        />
      )}
      {isLoading ? (
        skeletonField
      ) : (
        <TextField
          {...register("email")}
          label={t("form.email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      )}
      {isLoading ? (
        skeletonField
      ) : (
        <TextField
          {...register("zip")}
          label={t("form.zip")}
          error={!!errors.zip}
          helperText={errors.zip?.message}
          onChange={(e) =>
            setValue("zip", e.target.value.replace(/\D/g, "").slice(0, 5))
          }
        />
      )}
    </>
  );
}
