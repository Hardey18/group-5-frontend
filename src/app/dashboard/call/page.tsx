"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";
import { PhoneCall, Warning } from "@phosphor-icons/react";
import { StartCallCard } from "./components/StartCallCard";
import { RecordingPanel } from "./components/RecordingPanel";
import { ProcessingScreen } from "./components/ProcessingScreen";
import { ResultsPanel } from "./components/ResultsPanel";
import { api } from "@/lib/api/axios";
import { ComplaintPipelineResponse } from "@/types/call-pipeline";
import { D } from "./config/call-design-tokens";
// import { D } from "./components/call-design-tokens";

type Stage = "START" | "RECORDING" | "PROCESSING" | "RESULTS";

const STAGE_LABELS: Record<Stage, string> = {
  START:      "New Call",
  RECORDING:  "Recording",
  PROCESSING: "Processing",
  RESULTS:    "Results",
};

const STAGES: Stage[] = ["START", "RECORDING", "PROCESSING", "RESULTS"];

export default function CallPage() {
  const [stage, setStage] = useState<Stage>("START");
  const [callId, setCallId] = useState<string | null>(null);
  const [results, setResults] = useState<ComplaintPipelineResponse | null>(null);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const handleCallStarted = (id: string) => {
    setCallId(id);
    setStage("RECORDING");
  };

  const handleStopRecording = async (fullAudioBlob: Blob) => {
    setStage("PROCESSING");
    setErrorLocal(null);
    try {
      const formData = new FormData();
      formData.append("audioFile", fullAudioBlob, "complaint.webm");
      const res = await api.post("/ai/process-complaint", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success) {
        setResults(res.data.data);
        setStage("RESULTS");
      } else {
        throw new Error(res.data?.message || "Failed to process audio");
      }
    } catch (err: any) {
      console.error(err);
      setErrorLocal(err.message || "An error occurred during AI processing.");
      setStage("START");
    }
  };

  const handleReset = () => {
    setCallId(null);
    setResults(null);
    setErrorLocal(null);
    setStage("START");
  };

  const currentStageIndex = STAGES.indexOf(stage);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: D.bg,
        fontFamily: "'Outfit', 'Nunito', sans-serif",
        backgroundImage: `
          radial-gradient(ellipse 55% 35% at 10% 0%, #00C9B108 0%, transparent 55%),
          radial-gradient(ellipse 40% 25% at 90% 100%, #818CF808 0%, transparent 50%)
        `,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          borderBottom: `1px solid ${D.border}`,
          px: { xs: 3, md: 5 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          bgcolor: `${D.bg}D8`,
          backdropFilter: "blur(14px)",
        }}
      >
        {/* Brand */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${D.teal}22, ${D.indigo}22)`,
              border: `1px solid ${D.teal}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhoneCall size={16} color={D.teal} weight="fill" />
          </Box>
          <Box>
            <Typography sx={{ color: D.text, fontWeight: 800, fontSize: "0.95rem", lineHeight: 1, letterSpacing: "-0.01em" }}>
              Complaint Call
            </Typography>
            <Typography sx={{ color: D.textMuted, fontSize: "0.6rem", letterSpacing: "0.12em" }}>
              AI-POWERED PIPELINE
            </Typography>
          </Box>
        </Stack>

        {/* Stage breadcrumb */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {STAGES.map((s, i) => {
            const done = i < currentStageIndex;
            const active = i === currentStageIndex;
            return (
              <React.Fragment key={s}>
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.3,
                    borderRadius: "20px",
                    bgcolor: active ? `${D.teal}18` : done ? `${D.green}10` : "transparent",
                    border: `1px solid ${active ? D.teal + "44" : done ? D.green + "30" : "transparent"}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: active ? D.teal : done ? D.green : D.textFaint,
                    }}
                  >
                    {STAGE_LABELS[s]}
                  </Typography>
                </Box>
                {i < STAGES.length - 1 && (
                  <Box sx={{ width: 12, height: 1, bgcolor: done ? D.green + "40" : D.border }} />
                )}
              </React.Fragment>
            );
          })}
        </Stack>
      </Box>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <Container maxWidth="md" sx={{ py: 5 }}>
        {/* Global error */}
        {errorLocal && (
          <Fade in timeout={400}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                bgcolor: `${D.rose}12`,
                border: `1px solid ${D.rose}33`,
                borderRadius: "12px",
                px: 2.5,
                py: 2,
                mb: 4,
              }}
            >
              <Warning size={16} color={D.rose} weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
              <Box>
                <Typography sx={{ color: D.rose, fontWeight: 700, fontSize: "0.8rem", mb: 0.25 }}>
                  Processing Failed
                </Typography>
                <Typography sx={{ color: D.rose + "CC", fontSize: "0.75rem", lineHeight: 1.5 }}>
                  {errorLocal}
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}

        {stage === "START" && (
          <Fade in timeout={500}>
            <Box><StartCallCard onCallStarted={handleCallStarted} /></Box>
          </Fade>
        )}

        {stage === "RECORDING" && callId && (
          <Fade in timeout={500}>
            <Box><RecordingPanel callId={callId} onStop={handleStopRecording} /></Box>
          </Fade>
        )}

        {stage === "PROCESSING" && (
          <Fade in timeout={500}>
            <Box><ProcessingScreen /></Box>
          </Fade>
        )}

        {stage === "RESULTS" && results && (
          <Fade in timeout={500}>
            <Box><ResultsPanel data={results} onReset={handleReset} /></Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
}








// "use client";

// import React, { useState } from "react";
// import Box from "@mui/material/Box";
// import Container from "@mui/material/Container";
// import Fade from "@mui/material/Fade";
// import Alert from "@mui/material/Alert";

// import { StartCallCard } from "./components/StartCallCard";
// import { RecordingPanel } from "./components/RecordingPanel";
// import { ProcessingScreen } from "./components/ProcessingScreen";
// import { ResultsPanel } from "./components/ResultsPanel";

// import { api } from "@/lib/api/axios";
// import { ComplaintPipelineResponse } from "@/types/call-pipeline";

// type Stage = "START" | "RECORDING" | "PROCESSING" | "RESULTS";

// export default function CallPage() {
//   const [stage, setStage] = useState<Stage>("START");
//   const [callId, setCallId] = useState<string | null>(null);
//   const [results, setResults] = useState<ComplaintPipelineResponse | null>(null);
//   const [errorLocal, setErrorLocal] = useState<string | null>(null);

//   const handleCallStarted = (id: string) => {
//     setCallId(id);
//     setStage("RECORDING");
//   };

//   const handleStopRecording = async (fullAudioBlob: Blob) => {
//     setStage("PROCESSING");
//     setErrorLocal(null);

//     try {
//       const formData = new FormData();
//       formData.append("audioFile", fullAudioBlob, "complaint.webm");
      
//       const res = await api.post("/ai/process-complaint", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       if (res.data?.success) {
//         setResults(res.data.data);
//         setStage("RESULTS");
//       } else {
//         throw new Error(res.data?.message || "Failed to process audio");
//       }
//     } catch (err: any) {
//       console.error(err);
//       setErrorLocal(err.message || "An error occurred during AI processing.");
//       setStage("START"); 
//     }
//   };

//   const handleReset = () => {
//     setCallId(null);
//     setResults(null);
//     setErrorLocal(null);
//     setStage("START");
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 6 }}>
      
//       {errorLocal && (
//         <Alert severity="error" sx={{ mb: 4 }}>
//           {errorLocal}
//         </Alert>
//       )}

//       {stage === "START" && (
//         <Fade in timeout={500}>
//           <Box>
//             <StartCallCard onCallStarted={handleCallStarted} />
//           </Box>
//         </Fade>
//       )}

//       {stage === "RECORDING" && callId && (
//         <Fade in timeout={500}>
//           <Box>
//             <RecordingPanel callId={callId} onStop={handleStopRecording} />
//           </Box>
//         </Fade>
//       )}

//       {stage === "PROCESSING" && (
//         <Fade in timeout={500}>
//           <Box>
//             <ProcessingScreen />
//           </Box>
//         </Fade>
//       )}

//       {stage === "RESULTS" && results && (
//         <Fade in timeout={500}>
//           <Box>
//             <ResultsPanel data={results} onReset={handleReset} />
//           </Box>
//         </Fade>
//       )}
      
//     </Container>
//   );
// }
