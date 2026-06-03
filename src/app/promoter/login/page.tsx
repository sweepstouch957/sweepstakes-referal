'use client';

import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { promoterService } from '@/services/promoter.service';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});
type FormData = z.infer<typeof schema>;

export default function PromoterLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: FormData) =>
      promoterService.login(email, password),
    onSuccess: (data) => {
      Cookies.set('promoter_token', data.token, { expires: 7 });
      Cookies.set('promoter_user', JSON.stringify(data.user), { expires: 7 });
      router.push('/promoter/dashboard');
    },
  });

  const onSubmit = (data: FormData) => loginMutation.mutate(data);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0e0818',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'radial-gradient(ellipse at 50% 0%, oklch(0.25 0.08 320) 0%, #0e0818 70%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        {/* Logo / brand */}
        <Box textAlign="center" mb={4}>
          <Box
            component="img"
            src="https://res.cloudinary.com/proyectos-personales/image/upload/v1679455472/woocommerce-placeholder-600x600_xo2kmv.png"
            alt="Sweepstouch"
            sx={{ width: 56, height: 56, borderRadius: 2, mb: 2, display: 'none' }}
          />
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ color: '#ff4b9b', letterSpacing: '-0.02em', mb: 0.5 }}
          >
            Sweepstouch
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)' }}>
            Portal de Promotoras
          </Typography>
        </Box>

        {/* Card */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            bgcolor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
            backdropFilter: 'blur(12px)',
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', mb: 0.5 }}>
            Iniciar sesión
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', mb: 3 }}>
            Ingresa con tu correo y contraseña
          </Typography>

          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2, ...darkInputSx }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.35)' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 3, ...darkInputSx }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.35)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                    sx={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {loginMutation.isError && (
            <Alert
              severity="error"
              sx={{ mb: 2, bgcolor: 'rgba(255,72,72,0.1)', color: '#ff9494', border: '1px solid rgba(255,72,72,0.2)' }}
            >
              {(loginMutation.error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
                'Credenciales incorrectas. Intenta de nuevo.'}
            </Alert>
          )}

          <Box
            component="button"
            type="submit"
            disabled={loginMutation.isPending}
            sx={{
              width: '100%',
              py: 1.5,
              bgcolor: '#ff4b9b',
              color: '#fff',
              border: 'none',
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 15,
              cursor: loginMutation.isPending ? 'not-allowed' : 'pointer',
              opacity: loginMutation.isPending ? 0.7 : 1,
              transition: 'opacity 0.15s, transform 0.1s',
              '&:hover': { opacity: loginMutation.isPending ? 0.7 : 0.9 },
              '&:active': { transform: 'scale(0.98)' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              fontFamily: 'inherit',
            }}
          >
            {loginMutation.isPending ? (
              <CircularProgress size={18} sx={{ color: '#fff' }} />
            ) : (
              'Entrar'
            )}
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}

const darkInputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    bgcolor: 'rgba(255,255,255,0.05)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: '#ff4b9b' },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.45)',
    '&.Mui-focused': { color: '#ff4b9b' },
  },
  '& .MuiFormHelperText-root': { color: '#ff9494' },
};
