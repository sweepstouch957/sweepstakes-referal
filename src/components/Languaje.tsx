import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useLanguage } from "@/libs/context/LanguageContext";
import { useState } from "react";

export default function LanguageSwitcher() {
const { language, changeLanguage } = useLanguage();
  const [alignment, setAlignment] = useState<"es" | "en">(
    language as "es" | "en"
  );

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newLanguage: "es" | "en" | null
  ) => {
    if (newLanguage) {
      changeLanguage(newLanguage);
      setAlignment(newLanguage);
    }
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleChange}
      size="small"
      sx={{
        borderRadius: 2,
        border: "1.5px solid #ddd",
        backgroundColor: "#fff",
        "& .MuiToggleButton-root": {
          textTransform: "uppercase",
          fontWeight: 600,
          width: "50px",

          color: "#333",
          border: "none",
          paddingX: 2,
          "&.Mui-selected": {
            backgroundColor: "#ff4b9b",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#e03f88",
            },
          },
        },
      }}
    >
      <ToggleButton value="es">ESP</ToggleButton>
      <ToggleButton value="en">ENG</ToggleButton>
    </ToggleButtonGroup>
  );
}
