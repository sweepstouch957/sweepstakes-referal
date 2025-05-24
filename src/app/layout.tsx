import { Layout } from "@/provider/document";

// /app/layout.tsx
export const metadata = {
  title: "Win a Car | Sweepstouch",
  description: "Descripción del sitio",
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
