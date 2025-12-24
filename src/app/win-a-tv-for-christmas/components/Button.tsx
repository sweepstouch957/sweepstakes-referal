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
            backgroundColor: "#c62828",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
          }),
          ...(variant === "outlined" && {
            backgroundColor: "#fff",
            color: "#c62828",
            border: "2px solid #c62828",
            "&:hover": {
              backgroundColor: "#eeeeee",
              border: "2px solid #c62828",
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
