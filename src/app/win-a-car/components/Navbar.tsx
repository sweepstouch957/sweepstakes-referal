/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Avatar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Logo from "@public/sweepstouch.webp";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import UserMenu from "./UserMenu";
import { Person } from "@mui/icons-material";
import LanguageSwitcher from "@/components/Languaje";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [user, setUser] = useState<null | {
    firstName: string;
    lastName: string;
  }>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const pathName = usePathname();
  useEffect(() => {
    setIsLoading(true);
    const user: any = Cookies.get("sweepstakes_user");
    if (user) {
      setUser(JSON.parse(user));
    }
    setIsLoading(false);
  }, []);

  const handleScrollToForm = () => {
    if (pathName === "/win-a-car") {
      const formElement = document.getElementById("form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/win-a-car?scrollTo=form");
    }
  };

  const handleLogout = () => {
    Cookies.remove("sweepstakes_user");
    Cookies.remove("sweepstakes_cupons");
    Cookies.remove("sweepstakes_token");
    setUser(null);
    router.push("/win-a-car/login");
  };

  const handleLogin = () => {
    router.push("/win-a-car/login");
  };

  const initials =
    user && user?.firstName
      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
      : "";

  // Menu for mobile
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#ffffff",
        color: "#d7006e",
        boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Image
            src={Logo}
            alt="Sweepstouch"
            width={isMobile ? 180 : 200}
            height={isMobile ? 42 : 48}
          />

          {!isLoading && (
            <Box display="flex" alignItems="center" gap={2}>
              <LanguageSwitcher />
              {/* Desktop */}
              {!isMobile && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleScrollToForm}
                    sx={{
                      backgroundColor: "#ff4b9b",
                      borderRadius: "20px",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#e93d89" },
                    }}
                  >
                    {t("navbar.participate")}
                  </Button>
                  {!user ? (
                    <Button
                      variant="contained"
                      onClick={handleLogin}
                      sx={{
                        backgroundColor: "#ff4b9b",
                        borderRadius: "20px",
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#e93d89" },
                      }}
                      startIcon={<LoginIcon />}
                    >
                      {t("navbar.login")}
                    </Button>
                  ) : (
                    <>
                      <IconButton
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{
                          backgroundColor: "#ff4b9b",
                          color: "#fff",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#fff",
                            color: "#ff4b9b",
                            fontWeight: 700,
                            p: 4,
                          }}
                        >
                          {initials || <Person />}
                        </Avatar>
                      </IconButton>
                      <UserMenu
                        anchorEl={anchorEl}
                        setAnchorEl={setAnchorEl}
                        user={user}
                        handleLogout={handleLogout}
                      />
                    </>
                  )}
                </>
              )}
              {/* Mobile */}
              {isMobile && (
                <>
                  <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenuOpen}
                    sx={{
                      backgroundColor: "#ff4b9b",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 44,
                      height: 44,
                      "&:hover": { backgroundColor: "#e93d89" },
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        handleScrollToForm();
                      }}
                    >
                      {t("navbar.participate")}
                    </MenuItem>
                    {!user ? (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          handleLogin();
                        }}
                      >
                        <LoginIcon sx={{ mr: 1 }} /> {t("navbar.login")}
                      </MenuItem>
                    ) : (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          handleLogout();
                        }}
                      >
                        <Person sx={{ mr: 1 }} /> {t("navbar.logout")}
                      </MenuItem>
                    )}
                  </Menu>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
