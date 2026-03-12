import { Button } from "@mui/material";

type CustomButtonProps = React.ComponentProps<typeof Button>;

export default function CustomButton(props: CustomButtonProps) {
  const { variant = "contained", sx, ...rest } = props;

  return (
    <Button
      variant={variant}
      size="large"
      sx={[
        {
          minWidth: 190,
          minHeight: 58,
          px: 5.5,
          borderRadius: "14px",
          textTransform: "none",
          fontWeight: 800,
          fontSize: 16,
          boxShadow: variant === "contained" ? "0 12px 26px rgba(255, 20, 147, 0.28)" : "none",
          ...(variant === "contained" && {
            background: "linear-gradient(180deg, #ff1493 0%, #ff007f 100%)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(180deg, #f5128f 0%, #ea0077 100%)",
              boxShadow: "0 14px 30px rgba(255, 20, 147, 0.34)",
            },
          }),
          ...(variant === "outlined" && {
            backgroundColor: "#fff",
            color: "#ff1493",
            border: "2px solid #ff1493",
            "&:hover": {
              backgroundColor: "#fff5fa",
              border: "2px solid #ff1493",
            },
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {props.children}
    </Button>
  );
}
