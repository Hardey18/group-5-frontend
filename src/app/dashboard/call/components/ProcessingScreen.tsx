"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { CheckCircle, Circle, Spinner } from "@phosphor-icons/react";
import { D } from "../config/call-design-tokens";
// import { D } from "./call-design-tokens";

const STEPS = [
  { label: "Transcribing audio", sub: "Whisper ASR", icon: "🎙" },
  { label: "Analysing complaint", sub: "GPT-4o-mini", icon: "🧠" },
  { label: "Generating responses", sub: "Pidgin + English", icon: "💬" },
  { label: "Synthesising speech", sub: "Azure TTS", icon: "🔊" },
];

export function ProcessingScreen() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const progress = ((activeStep + 1) / STEPS.length) * 100;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 460,
          bgcolor: D.surface,
          border: `1px solid ${D.border}`,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: `0 32px 80px #00000050`,
        }}
      >
        {/* Animated progress bar at top */}
        <Box sx={{ height: 3, bgcolor: D.surfaceAlt, position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${D.indigo}, ${D.teal})`,
              borderRadius: "0 4px 4px 0",
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            {/* Orbiting spinner orb */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2.5 }}>
              <Box sx={{ position: "relative", width: 72, height: 72 }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 35%, ${D.indigo}28, ${D.teal}14)`,
                    border: `1.5px solid ${D.indigo}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  {STEPS[activeStep].icon}
                </Box>
                {/* Rotating ring */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: "50%",
                    border: `2px solid transparent`,
                    borderTopColor: D.indigo,
                    borderRightColor: D.teal,
                    animation: "spin 1.2s linear infinite",
                    "@keyframes spin": { to: { transform: "rotate(360deg)" } },
                  }}
                />
              </Box>
            </Box>

            <Typography
              sx={{
                color: D.text,
                fontWeight: 800,
                fontSize: "1.1rem",
                letterSpacing: "-0.02em",
                mb: 0.5,
              }}
            >
              Processing your call
            </Typography>
            <Typography sx={{ color: D.textMuted, fontSize: "0.78rem" }}>
              Step {activeStep + 1} of {STEPS.length} · Please wait
            </Typography>
          </Box>

          {/* Steps list */}
          <Stack spacing={0} sx={{ mb: 0 }}>
            {STEPS.map((step, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;
              const isPending = index > activeStep;

              return (
                <Box
                  key={step.label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1.5,
                    px: 2,
                    borderRadius: "10px",
                    bgcolor: isActive ? `${D.indigo}10` : "transparent",
                    border: `1px solid ${isActive ? D.indigo + "30" : "transparent"}`,
                    mb: 1,
                    transition: "all 0.4s ease",
                    animation: isActive
                      ? "stepFadeIn 0.4s ease both"
                      : "none",
                    "@keyframes stepFadeIn": {
                      from: { opacity: 0.5, transform: "translateX(-4px)" },
                      to: { opacity: 1, transform: "none" },
                    },
                  }}
                >
                  {/* Icon */}
                  <Box sx={{ flexShrink: 0, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isCompleted ? (
                      <CheckCircle size={22} color={D.green} weight="fill" />
                    ) : isActive ? (
                      <Box
                        sx={{
                          animation: "spinStep 1s linear infinite",
                          "@keyframes spinStep": { to: { transform: "rotate(360deg)" } },
                          display: "flex",
                        }}
                      >
                        <Spinner size={22} color={D.indigo} weight="bold" />
                      </Box>
                    ) : (
                      <Circle size={22} color={D.textFaint} />
                    )}
                  </Box>

                  {/* Text */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        color: isCompleted ? D.green : isActive ? D.text : D.textMuted,
                        fontSize: "0.85rem",
                        fontWeight: isActive ? 700 : isCompleted ? 600 : 400,
                        lineHeight: 1.2,
                        transition: "color 0.3s",
                      }}
                    >
                      {step.label}
                    </Typography>
                    <Typography
                      sx={{
                        color: isCompleted ? D.green + "99" : D.textFaint,
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        mt: 0.15,
                        transition: "color 0.3s",
                      }}
                    >
                      {step.sub}
                    </Typography>
                  </Box>

                  {/* Right indicator */}
                  {isCompleted && (
                    <Typography sx={{ color: D.green + "80", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em" }}>
                      DONE
                    </Typography>
                  )}
                  {isActive && (
                    <Typography
                      sx={{
                        color: D.indigo,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        animation: "blink 1.5s ease-in-out infinite",
                        "@keyframes blink": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } },
                      }}
                    >
                      RUNNING
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}



// "use client";

// import React, { useEffect, useState } from "react";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// // import LinearProgress from "@mui/material/LinearProgress";
// import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
// import { Circle as CircleIcon } from "@phosphor-icons/react/dist/ssr/Circle";

// const STEPS = [
//   "Transcribing audio (Whisper)",
//   "Analysing complaint (GPT-4o-mini)",
//   "Generating responses",
//   "Synthesising speech (Azure TTS)"
// ];

// export function ProcessingScreen() {
//   const [activeStep, setActiveStep] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveStep((prev) => {
//         if (prev < STEPS.length - 1) return prev + 1;
//         return prev;
//       });
//     }, 2500); 

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh" gap={4}>
//       <Box sx={{ width: '100%', maxWidth: 500 }}>
//         <Typography variant="h5" align="center" gutterBottom>
//           Processing your complaint through AI pipeline...
//         </Typography>
//         {/* <LinearProgress sx={{ mt: 2, mb: 4, height: 8, borderRadius: 4 }} /> */}

//         <Box display="flex" flexDirection="column" gap={2}>
//           {STEPS.map((step, index) => {
//             const isCompleted = index <= activeStep;
//             return (
//                <Box key={step} display="flex" alignItems="center" gap={2}>
//                 <Typography 
//                   color={isCompleted ? "success.main" : "text.secondary"} 
//                   display="flex"
//                 >
//                   {isCompleted ? <CheckCircleIcon size={24} weight="fill" /> : <CircleIcon size={24} />}
//                 </Typography>
//                 <Typography 
//                    variant="body1" 
//                    color={isCompleted ? "text.primary" : "text.secondary"}
//                    sx={{ fontWeight: isCompleted ? 500 : 400 }}
//                 >
//                   {step}
//                 </Typography>
//               </Box>
//             );
//           })}
//         </Box>
//       </Box>
//     </Box>
//   );
// }
