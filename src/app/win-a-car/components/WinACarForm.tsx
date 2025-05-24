"use client";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Stack,
  FormControl,
  FormLabel,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Store,
  Link as LinkIcon,
  Person,
  PersonOutline,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerParticipant } from "@/services/sweeptake.service";

// Props
type Props = {
  showExtendedFields?: boolean;
  tokenValue?: string;
  storeName?: string;
  isLoading?: boolean;
  sweepstakeId?: string;
  storeId?: string;
};

export default function WinACarForm({
  showExtendedFields = false,
  tokenValue = "",
  storeName = "",
  isLoading = false,
  sweepstakeId = "",
  storeId = "",
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  console.log("Store Name:", storeName);
  console.log("Token Value:", tokenValue);
  console.log("Sweepstake ID:", sweepstakeId);
  console.log("Store ID:", storeId);

  const router = useRouter();

  const baseSchema = z.object({
    firstName: z
      .string()
      .min(1, "First Name is required")
      .max(50, "First Name must be less than 50 characters"),
    lastName: z
      .string()
      .min(1, "Last Name is required")
      .max(50, "Last Name must be less than 50 characters"),
    phone: z
      .string()
      .regex(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        "Phone must be in format (123) 456-7890"
      ),
    email: z.string().email("Invalid email address"),
    zip: z.string().regex(/^\d{5}$/, "Zip code must be 5 digits"),
    referralCode: z.string(),
    supermarket: z.string().optional(),
  });

  type FormData = z.infer<typeof baseSchema>;

  const [backendError, setBackendError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    mode: "onBlur",
    defaultValues: {
      phone: "",
      email: "",
      zip: "",
      referralCode: tokenValue || "",
      supermarket: storeName || "",
    },
  });

  const mutation = useMutation({
    mutationFn: registerParticipant,
    onSuccess: (data) => {
      setBackendError(null);
      const redirectURL = showExtendedFields
        ? `/thank-you?referralCode=${
            data.referralCode
          }&supermarket=${encodeURIComponent(storeName)}`
        : `/thank-you?referralCode=${data.referralCode}`;
      reset();
      router.push(redirectURL);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setBackendError(error?.error || "Unknown error");
    },
  });

  const onSubmit = (data: FormData) => {
    const cleanPhone = data.phone.replace(/[^\d]/g, "");
    mutation.mutate({
      sweepstakeId,
      storeId,
      referralCode: data.referralCode,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      zipCode: data.zip,
      customerPhone: `${cleanPhone}`,
      method: "referral",
    });
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{0,4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`;
    }
    return cleaned;
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phone", formatted);
  };

  const handleZipInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 5);
    setValue("zip", cleaned);
  };

  return (
    <Container maxWidth="sm" sx={{ my: 6 }} component="section" id="form">
      <Typography
        variant={isMobile ? "h4" : "h3"}
        textAlign="center"
        fontWeight={800}
        color="#ff4b9b"
        mb={4}
      >
        Win a 2025 Nissan Versa!
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#ff4b9b",
            },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#ff4b9b",
          },
        }}
      >
        <Stack spacing={2}>
          <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
            <Box>
              {isLoading ? (
                <Skeleton height={56} variant="rounded" />
              ) : (
                <TextField
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  placeholder="First Name"
                  fullWidth
                  inputProps={{
                    maxLength: 50,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Box>
            <Box>
              {isLoading ? (
                <Skeleton height={56} variant="rounded" />
              ) : (
                <TextField
                  {...register("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  placeholder="Last Name"
                  fullWidth
                  inputProps={{
                    maxLength: 50,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Box>
          </Stack>

          {isLoading ? (
            <Skeleton height={56} variant="rounded" />
          ) : (
            <TextField
              placeholder="Phone Number"
              {...register("phone")}
              onChange={handlePhoneInput}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {isLoading ? (
            <Skeleton height={56} variant="rounded" />
          ) : (
            <TextField
              placeholder="E-mail"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {isLoading ? (
            <Skeleton height={56} variant="rounded" />
          ) : (
            <TextField
              placeholder="Zip Code"
              {...register("zip")}
              onChange={handleZipInput}
              error={!!errors.zip}
              helperText={errors.zip?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {isLoading ? (
            <Skeleton height={56} variant="rounded" />
          ) : (
            <FormControl fullWidth>
              <FormLabel>Referral Code</FormLabel>
              <TextField
                placeholder="Referral Code"
                {...register("referralCode")}
                disabled={!!tokenValue}
                error={!!errors.referralCode}
                helperText={errors.referralCode?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          )}

          {showExtendedFields && (
            <>
              {isLoading ? (
                <Skeleton height={56} variant="rounded" />
              ) : (
                <TextField
                  placeholder="Supermarket"
                  {...register("supermarket")}
                  error={!!errors.supermarket}
                  helperText={errors.supermarket?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Store />
                      </InputAdornment>
                    ),
                  value: storeName,
                  disabled: true,
                  }}
                />
              )}
            </>
          )}

          <Typography
            variant="caption"
            display="block"
            mt={1}
            textAlign="center"
            color="text.secondary"
          >
            By participating, you agree to receive promotional messages. View
            our terms and conditions.
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
              backgroundColor: "#ff4b9b",
              textTransform: "uppercase",
              "&:hover": {
                backgroundColor: "#e93d89",
              },
            }}
            disabled={isLoading}
          >
            Participate Now
          </Button>
        </Stack>
        {backendError && (
          <Alert
            severity="error"
            onClose={() => setBackendError(null)}
            sx={{ mt: 2 }}
          >
            {backendError}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
