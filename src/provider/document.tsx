"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { useState, type FC, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import theme from "@/theme/dark.theme";
import { LanguageProvider } from "@/libs/context/LanguageContext";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = (props: LayoutProps) => {
  const { children } = props;
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};
