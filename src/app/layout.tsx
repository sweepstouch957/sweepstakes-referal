// /app/layout.tsx
// src/app/layout.tsx
import '../styles/fonts.css';
// ...el resto del layout
import { Layout } from "@/provider/document";

export const metadata = {
  title: "Win a Car | Sweepstouch",
  description: "¡Participa por un carro nuevo! Comparte tu link de referido y gana más oportunidades de ganar en el sorteo de Sweepstouch.",
  openGraph: {
    title: "Win a Car | Sweepstouch",
    description: "Invita a tus amigos y por cada referido obtén más participaciones. ¡Entre más compartas, más chances tienes de ganar un carro totalmente nuevo!",
    url: "https://sweepstakes.tech-touch.com/win-a-car",
    siteName: "Sweepstouch",
    images: [
      {
        url: "https://res.cloudinary.com/dg9gzic4s/image/upload/v1748571721/MMS_-_SPANISH_1_fxujzr.png", // Pon aquí tu imagen real
        width: 1200,
        height: 630,
        alt: "Participa en el sorteo de un carro con Sweepstouch",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Sweepstouch", // Cambia por tu usuario
    title: "Win a Car | Sweepstouch",
    description: "Invita a tus amigos y gana más participaciones para el sorteo del carro. ¡Comparte tu link y aumenta tus oportunidades de ganar!",
    images: [
      "https://res.cloudinary.com/dg9gzic4s/image/upload/v1748571721/MMS_-_SPANISH_1_fxujzr.png", // Igual aquí la misma imagen
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
