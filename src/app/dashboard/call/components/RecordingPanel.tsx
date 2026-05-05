"use client";

import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { api } from "@/lib/api/axios";

interface RecordingPanelProps {
  callId: string;
  onStop: (fullAudioBlob: Blob) => void;
}

export function RecordingPanel({ callId, onStop }: RecordingPanelProps) {
  const sequenceRef = useRef(1);
  const [chunksSent, setChunksSent] = useState(0);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const handleChunkAvailable = async (blob: Blob) => {
    try {
      const buffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      if (bytes.length === 0) return;
      
      const binaryString = Array.from(bytes).map(byte => String.fromCharCode(byte)).join("");
      const chunkBase64 = btoa(binaryString);

      const seq = sequenceRef.current++;
      const payload = {
        callId,
        sequence: seq,
        chunkBase64,
        audioUrl: null,
        sentAtUtc: new Date().toISOString()
      };
      
      const res = await api.post("/stream/audio-chunk", payload);
      if (res.data?.success) {
        setChunksSent(seq); 
        setErrorLocal(null); 
      } else {
        console.error("Chunk rejected:", res.data);
      }
    } catch (err: any) {
      // console.error("Failed to push chunk:", err);
      setErrorLocal("Warning: A chunk failed to synchronize with the server. Recording continues.");
    }
  };

  const { startRecording, stopRecording, isRecording, elapsedSeconds, error } = useAudioRecorder({
    onChunkAvailable: handleChunkAvailable,
    timeslice: 2000
  });

  useEffect(() => {
    startRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStop = async () => {
    const fullAudioBlob = await stopRecording();
    if (fullAudioBlob) {
      onStop(fullAudioBlob);
    }
  };

  const formatSeconds = (sec: number) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <Card sx={{ minWidth: 400, textAlign: 'center', p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Call Active
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ID: {callId}
          </Typography>

          <Box my={4} display="flex" flexDirection="column" alignItems="center" gap={2}>
            {isRecording ? (
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'error.main',
                    animation: 'pulse 1.5s infinite ease-in-out',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)', opacity: 1 },
                      '50%': { transform: 'scale(1.5)', opacity: 0.5 },
                      '100%': { transform: 'scale(1)', opacity: 1 },
                    }
                  }}
                />
                <Typography variant="h4" color="error.main">
                  {formatSeconds(elapsedSeconds)}
                </Typography>
              </Box>
            ) : (
              <Typography variant="h6">Finishing up...</Typography>
            )}

            <Typography variant="body2" color="text.secondary">
              Chunks Sent: {chunksSent}
            </Typography>
          </Box>

          {(error || errorLocal) && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {error || errorLocal}
            </Alert>
          )}

          <Button 
            variant="contained" 
            color="error" 
            size="large" 
            onClick={handleStop}
            disabled={!isRecording}
            sx={{ px: 4, py: 1.5, borderRadius: 8 }}
          >
            Stop & Process
          </Button>

        </CardContent>
      </Card>
    </Box>
  );
}
