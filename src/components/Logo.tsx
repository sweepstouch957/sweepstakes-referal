'use client';
import { Box } from '@mui/material';
import Image from 'next/image';

type LogoProps = {
  /** URL de la imagen (puede ser remota o local) */
  src: string;
  /** Texto alternativo de la imagen */
  alt?: string;
  /** Altura del contenedor en px */
  height?: number;
  /** Ancho del contenedor (acepta valores responsivos de MUI) */
  width?: number | string | object;
  /** Color de fondo */
  bgColor?: string;
  /** Si quieres desactivar el efecto zoom */
  disableZoom?: boolean;
};

export default function Logo({
  src,
  alt = 'Logo',
  height = 150,
  width,
  disableZoom = false,
}: LogoProps) {
  return (
    <Box sx={{ width: width ?? { xs: 80, sm: 140 } }}>
      <Box
        sx={{
          height,
          borderRadius: 0.25,
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transition: disableZoom ? 'none' : 'transform 0.4s ease',
            '&:hover': disableZoom
              ? {}
              : {
                transform: 'scale(1.15)',
              },
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            style={{
              objectFit: 'contain',
              userSelect: 'none',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
