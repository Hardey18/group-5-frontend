"use client";

import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import { GenerateStep } from "./components/GenerateStep";
import { ApproveStep } from "./components/ApproveStep";
import { SendStep } from "./components/SendStep";
import { ResultSummary } from "./components/ResultSummary";
import { useFollowUp } from "./hooks/useFollowUp";

const STEPS = ["Generate", "Approve", "Send"];

export default function FollowUpPage() {
  const hook = useFollowUp();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box mb={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Follow-Up Message Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-driven client communication pipeline.
        </Typography>
      </Box>

      {hook.step < 3 && (
        <Box mb={5}>
          <Stepper activeStep={hook.step} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      {/* Render Current Step Component */}
      {hook.step === 0 && <GenerateStep hook={hook} />}
      {hook.step === 1 && <ApproveStep hook={hook} />}
      {hook.step === 2 && <SendStep hook={hook} />}
      {hook.step === 3 && <ResultSummary hook={hook} />}

      {/* Global Toast via Snackbar */}
      <Snackbar
        open={Boolean(hook.successToast)}
        autoHideDuration={4000}
        onClose={hook.clearToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={hook.clearToast} 
          severity="success" 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {hook.successToast}
        </Alert>
      </Snackbar>
      
    </Container>
  );
}
