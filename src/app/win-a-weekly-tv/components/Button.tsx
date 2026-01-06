import { Button } from "@mui/material";

type CustomButtonProps = React.ComponentProps<typeof Button>;

export default function CustomButton(props: CustomButtonProps) {
  const {
    variant = "contained",
    sx,
    ...rest
  } = props;

  return (
    <Button
      variant={variant}
      size="large"
      sx={[
        {
          borderRadius: "20px",
          textTransform: "none",
          ...(variant === "contained" && {
            backgroundColor: "#ff4b9b",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#e93d89",
            },
          }),
          ...(variant === "outlined" && {
            backgroundColor: "#fff",
            color: "#ff4b9b",
            border: "2px solid #ff4b9b",
            "&:hover": {
              backgroundColor: "#eeeeee",
              border: "2px solid #ff4b9b",
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
