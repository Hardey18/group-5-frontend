"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import Alert from "@mui/material/Alert";

import { StartCallCard } from "./components/StartCallCard";
import { RecordingPanel } from "./components/RecordingPanel";
import { ProcessingScreen } from "./components/ProcessingScreen";
import { ResultsPanel } from "./components/ResultsPanel";

import { api } from "@/lib/api/axios";
import { ComplaintPipelineResponse } from "@/types/call-pipeline";

type Stage = "START" | "RECORDING" | "PROCESSING" | "RESULTS";

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
        headers: { "Content-Type": "multipart/form-data" }
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

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      
      {errorLocal && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {errorLocal}
        </Alert>
      )}

      {stage === "START" && (
        <Fade in timeout={500}>
          <Box>
            <StartCallCard onCallStarted={handleCallStarted} />
          </Box>
        </Fade>
      )}

      {stage === "RECORDING" && callId && (
        <Fade in timeout={500}>
          <Box>
            <RecordingPanel callId={callId} onStop={handleStopRecording} />
          </Box>
        </Fade>
      )}

      {stage === "PROCESSING" && (
        <Fade in timeout={500}>
          <Box>
            <ProcessingScreen />
          </Box>
        </Fade>
      )}

      {stage === "RESULTS" && results && (
        <Fade in timeout={500}>
          <Box>
            <ResultsPanel data={results} onReset={handleReset} />
          </Box>
        </Fade>
      )}
      
    </Container>
  );
}
