"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Circle as CircleIcon } from "@phosphor-icons/react/dist/ssr/Circle";

const STEPS = [
  "Transcribing audio (Whisper)",
  "Analysing complaint (GPT-4o-mini)",
  "Generating responses",
  "Synthesising speech (Azure TTS)"
];

export function ProcessingScreen() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 2500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh" gap={4}>
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Processing your complaint through AI pipeline...
        </Typography>
        {/* <LinearProgress sx={{ mt: 2, mb: 4, height: 8, borderRadius: 4 }} /> */}

        <Box display="flex" flexDirection="column" gap={2}>
          {STEPS.map((step, index) => {
            const isCompleted = index <= activeStep;
            return (
               <Box key={step} display="flex" alignItems="center" gap={2}>
                <Typography 
                  color={isCompleted ? "success.main" : "text.secondary"} 
                  display="flex"
                >
                  {isCompleted ? <CheckCircleIcon size={24} weight="fill" /> : <CircleIcon size={24} />}
                </Typography>
                <Typography 
                   variant="body1" 
                   color={isCompleted ? "text.primary" : "text.secondary"}
                   sx={{ fontWeight: isCompleted ? 500 : 400 }}
                >
                  {step}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
