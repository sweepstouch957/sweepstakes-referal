import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import { useTranslation } from "react-i18next";

const CustomConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 23,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    background: "linear-gradient(90deg, #e4007f 0%, #ff1493 100%)",
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    background: "linear-gradient(90deg, #e4007f 0%, #ff1493 100%)",
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eed9e9",
    borderRadius: 2,
  },
}));

const CustomStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
  backgroundColor: "#e5e7eb",
  zIndex: 1,
  color: "#9ca3af",
  width: 48,
  height: 48,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.25s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  border: "3px solid transparent",
  ...(ownerState.active && {
    background: "linear-gradient(145deg, #ff1493 0%, #e4007f 100%)",
    color: "#ffffff",
    borderColor: "rgba(255,20,147,0.2)",
    boxShadow: "0 6px 20px rgba(228,0,127,0.30)",
  }),
  ...(ownerState.completed && {
    background: "linear-gradient(145deg, #ff1493 0%, #e4007f 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 12px rgba(228,0,127,0.22)",
  }),
}));

function CustomStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <AccountCircleOutlinedIcon sx={{ fontSize: 24 }} />,
    2: <ShieldOutlinedIcon sx={{ fontSize: 24 }} />,
  };

  return (
    <CustomStepIconRoot ownerState={{ completed, active }} className={className}>
      {completed
        ? <CheckCircleOutlineIcon sx={{ fontSize: 22 }} />
        : icons[String(props.icon)]}
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

  if (variant === "personalOnly") {
    return (
      <Stack sx={{ width: "100%" }} spacing={4}>
        <Stepper alternativeLabel activeStep={0} connector={<CustomConnector />}>
          <Step key="info">
            <StepLabel StepIconComponent={CustomStepIcon}>{t("referralStep.step1")}</StepLabel>
          </Step>
        </Stepper>
      </Stack>
    );
  }

  const steps = [t("referralStep.step1"), t("referralStep.step3")];

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
