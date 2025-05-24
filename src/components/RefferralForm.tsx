"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Stack,
  FormControl,
  FormLabel,
  Alert,
  Skeleton,
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

interface Props {
  onSubmit: (data: FormData) => void;
  defaultReferralCode?: string;
  defaultStoreName?: string;
  isLoading?: boolean;
  backendError?: string | null;
  onClearError?: () => void;
  showExtendedFields?: boolean;
}

const schema = z.object({
  firstName: z.string().min(1, "First Name is required").max(50),
  lastName: z.string().min(1, "Last Name is required").max(50),
  phone: z
    .string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone must be in format (123) 456-7890"),
  email: z.string().email("Invalid email address"),
  zip: z.string().regex(/^\d{5}$/, "Zip code must be 5 digits"),
  referralCode: z.string(),
  supermarket: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ReferralForm({
  onSubmit,
  defaultReferralCode = "",
  defaultStoreName = "",
  isLoading = false,
  backendError,
  onClearError,
  showExtendedFields = false,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      phone: "",
      email: "",
      zip: "",
      referralCode: defaultReferralCode,
      supermarket: defaultStoreName,
    },
  });

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{0,4})$/);
    if (match)
      return `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`;
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
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      id="form"
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
        {isLoading ? (
          <Skeleton height={56} variant="rounded" />
        ) : (
          <TextField
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            placeholder="First Name"
            fullWidth
            inputProps={{ maxLength: 50 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
        )}
        {isLoading ? (
          <Skeleton height={56} variant="rounded" />
        ) : (
          <TextField
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            placeholder="Last Name"
            fullWidth
            inputProps={{ maxLength: 50 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline />
                </InputAdornment>
              ),
            }}
          />
        )}

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
              defaultValue={defaultReferralCode}
              error={!!errors.referralCode}
              helperText={errors.referralCode?.message}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: "#fff", // o cualquier color que mantenga el diseño
                  cursor: "not-allowed",
                  "& input": {
                    color: "#000", // mantener color de texto si lo necesitas
                  },
                },
              }}
            />
          </FormControl>
        )}

        {showExtendedFields &&
          (isLoading ? (
            <Skeleton height={56} variant="rounded" />
          ) : (
            <TextField
              placeholder="Supermarket"
              {...register("supermarket")}
              error={!!errors.supermarket}
              helperText={errors.supermarket?.message}
              defaultValue={defaultStoreName}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Store />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: "#fff", // o cualquier color que mantenga el diseño
                  cursor: "not-allowed",
                  "& input": {
                    color: "#000", // mantener color de texto si lo necesitas
                  },
                },
                disabled: !!defaultStoreName, // deshabilitar si no hay nombre de tienda
              }}
            />
          ))}

        <Typography variant="caption" textAlign="center" color="text.secondary">
          By participating, you agree to receive promotional messages. View our
          terms and conditions.
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
            "&:hover": { backgroundColor: "#e93d89" },
          }}
          disabled={isLoading}
        >
          Participate Now
        </Button>

        {backendError && (
          <Alert severity="error" onClose={onClearError} sx={{ mt: 2 }}>
            {backendError}
          </Alert>
        )}
      </Stack>
    </Box>
  );
}
