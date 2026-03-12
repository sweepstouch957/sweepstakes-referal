import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import { useTranslation } from "react-i18next";

const CustomConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundColor: "#d7006e",
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: "#d7006e",
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}));

const CustomStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
  backgroundColor: "#d9d9d9",
  zIndex: 1,
  color: "#ffffff",
  width: 54,
  height: 54,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.2s ease",
  boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
  border: "4px solid transparent",
  ...(ownerState.active && {
    backgroundColor: "#e4007f",
    borderColor: "#ffd200",
    boxShadow: "0 10px 22px rgba(0,0,0,.18)",
  }),
  ...(ownerState.completed && {
    backgroundColor: "#e4007f",
  }),
}));

function CustomStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <AccountCircleOutlinedIcon sx={{ fontSize: 28 }} />,
    2: <KeyOutlinedIcon sx={{ fontSize: 28 }} />,
    3: <ShieldOutlinedIcon sx={{ fontSize: 28 }} />,
  };

  return (
    <CustomStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </CustomStepIconRoot>
  );
}

export default function CustomReferralStepper({
  activeStep = 0,
  variant = "full",
}: {
  activeStep: number;
  variant?: "full" | "personalOnly";
}) {
  const { t } = useTranslation();

  const steps =
    variant === "personalOnly"
      ? [t("referralStep.step1")]
      : [t("referralStep.step1"), t("referralStep.step2"), t("referralStep.step3")];

  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<CustomConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}