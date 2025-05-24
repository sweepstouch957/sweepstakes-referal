"use client";

import { AppBar, Toolbar, Button, Container } from "@mui/material";
import Image from "next/image";
import Logo from "@public/sweepstouch.webp";

export default function Navbar() {
  const handleScrollToForm = () => {
    const formElement = document.getElementById("form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
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
          <Image src={Logo} alt="Sweepstouch" width={200} height={48} />

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
            Participate
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
