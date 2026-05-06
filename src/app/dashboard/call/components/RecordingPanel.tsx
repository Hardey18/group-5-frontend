"use client";

import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { MicrophoneStage, StopCircle, Warning, WifiHigh } from "@phosphor-icons/react";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { api } from "@/lib/api/axios";
import { D } from "../config/call-design-tokens";
// import { D } from "./call-design-tokens";

interface RecordingPanelProps {
  callId: string;
  onStop: (fullAudioBlob: Blob) => void;
}

// Animated waveform bars
function Waveform({ active }: { active: boolean }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "3px", height: 40 }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 3,
            borderRadius: 4,
            bgcolor: active ? D.rose : D.textFaint,
            height: active ? `${Math.random() * 60 + 20}%` : "15%",
            animation: active ? "wave 0.8s ease-in-out infinite alternate" : "none",
            animationDelay: `${i * 0.06}s`,
            transition: "background-color 0.4s",
            "@keyframes wave": {
              from: { height: "15%" },
              to: { height: `${Math.random() * 70 + 20}%` },
            },
          }}
        />
      ))}
    </Box>
  );
}

export function RecordingPanel({ callId, onStop }: RecordingPanelProps) {
  const sequenceRef = useRef(1);
  const [chunksSent, setChunksSent] = useState(0);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [stopping, setStopping] = useState(false);

  const handleChunkAvailable = async (blob: Blob) => {
    try {
      const buffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      if (bytes.length === 0) return;

      const binaryString = Array.from(bytes).map((byte) => String.fromCharCode(byte)).join("");
      const chunkBase64 = btoa(binaryString);
      const seq = sequenceRef.current++;

      const res = await api.post("/stream/audio-chunk", {
        callId,
        sequence: seq,
        chunkBase64,
        audioUrl: null,
        sentAtUtc: new Date().toISOString(),
      });

      if (res.data?.success) {
        setChunksSent(seq);
        setErrorLocal(null);
      } else {
        console.error("Chunk rejected:", res.data);
      }
    } catch {
      setErrorLocal("A chunk failed to sync. Recording continues.");
    }
  };

  const { startRecording, stopRecording, isRecording, elapsedSeconds, error } = useAudioRecorder({
    onChunkAvailable: handleChunkAvailable,
    timeslice: 2000,
  });

  useEffect(() => {
    startRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStop = async () => {
    setStopping(true);
    const fullAudioBlob = await stopRecording();
    if (fullAudioBlob) {
      onStop(fullAudioBlob);
    }
  };

  const formatSeconds = (sec: number) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

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
          maxWidth: 440,
          bgcolor: D.surface,
          border: `1px solid ${D.border}`,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: `0 32px 80px #00000050`,
        }}
      >
        {/* Top accent — red for active recording */}
        <Box
          sx={{
            height: 3,
            background: isRecording
              ? `linear-gradient(90deg, ${D.rose}, ${D.amber} 60%, transparent)`
              : `linear-gradient(90deg, ${D.textMuted}, transparent)`,
            transition: "background 0.5s",
          }}
        />

        <Box sx={{ p: 4 }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
            <Box>
              <Typography sx={{ color: D.text, fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
                {stopping ? "Finishing up…" : "Call Active"}
              </Typography>
              <Typography sx={{ color: D.textMuted, fontSize: "0.68rem", fontFamily: "monospace", mt: 0.25 }}>
                ID: {callId}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.5,
                py: 0.5,
                bgcolor: isRecording ? `${D.rose}15` : `${D.textMuted}12`,
                border: `1px solid ${isRecording ? D.rose + "44" : D.border}`,
                borderRadius: "20px",
                transition: "all 0.3s",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: isRecording ? D.rose : D.textMuted,
                  ...(isRecording && {
                    animation: "recpulse 1.2s ease-in-out infinite",
                    "@keyframes recpulse": {
                      "0%,100%": { opacity: 1, transform: "scale(1)" },
                      "50%": { opacity: 0.4, transform: "scale(0.8)" },
                    },
                  }),
                }}
              />
              <Typography sx={{ color: isRecording ? D.rose : D.textMuted, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em" }}>
                {isRecording ? "REC" : "STOPPED"}
              </Typography>
            </Box>
          </Stack>

          {/* Timer */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              sx={{
                color: isRecording ? D.rose : D.textMuted,
                fontSize: "4rem",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                transition: "color 0.4s",
                textShadow: isRecording ? `0 0 40px ${D.rose}40` : "none",
              }}
            >
              {formatSeconds(elapsedSeconds)}
            </Typography>
          </Box>

          {/* Waveform */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3.5 }}>
            <Waveform active={isRecording} />
          </Box>

          {/* Chunks sent */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: D.surfaceAlt,
              border: `1px solid ${D.border}`,
              borderRadius: "10px",
              px: 2,
              py: 1.25,
              mb: 3,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <WifiHigh size={14} color={D.teal} weight="fill" />
              <Typography sx={{ color: D.textMuted, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em" }}>
                SYNCED CHUNKS
              </Typography>
            </Stack>
            <Typography sx={{ color: D.teal, fontWeight: 700, fontSize: "0.82rem", fontFamily: "monospace" }}>
              {chunksSent}
            </Typography>
          </Box>

          {/* Warning */}
          {(error || errorLocal) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
                bgcolor: `${D.amber}12`,
                border: `1px solid ${D.amber}33`,
                borderRadius: "10px",
                px: 2,
                py: 1.5,
                mb: 2.5,
              }}
            >
              <Warning size={15} color={D.amber} weight="fill" style={{ flexShrink: 0, marginTop: 1 }} />
              <Typography sx={{ color: D.amber, fontSize: "0.75rem", lineHeight: 1.5 }}>
                {error || errorLocal}
              </Typography>
            </Box>
          )}

          {/* Stop button */}
          <Box
            component="button"
            onClick={handleStop}
            disabled={!isRecording || stopping}
            sx={{
              width: "100%",
              py: 1.75,
              borderRadius: "12px",
              border: `1.5px solid ${!isRecording || stopping ? D.border : D.rose + "66"}`,
              cursor: !isRecording || stopping ? "not-allowed" : "pointer",
              bgcolor: !isRecording || stopping ? D.surfaceAlt : `${D.rose}18`,
              color: !isRecording || stopping ? D.textMuted : D.rose,
              fontSize: "0.92rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s",
              "&:hover:not(:disabled)": {
                bgcolor: `${D.rose}28`,
                borderColor: D.rose,
                boxShadow: `0 8px 24px ${D.rose}20`,
                transform: "translateY(-1px)",
              },
            }}
          >
            <StopCircle size={18} weight="fill" />
            <span>Stop & Process</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}







// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import Alert from "@mui/material/Alert";
// import { useAudioRecorder } from "../hooks/useAudioRecorder";
// import { api } from "@/lib/api/axios";

// interface RecordingPanelProps {
//   callId: string;
//   onStop: (fullAudioBlob: Blob) => void;
// }

// export function RecordingPanel({ callId, onStop }: RecordingPanelProps) {
//   const sequenceRef = useRef(1);
//   const [chunksSent, setChunksSent] = useState(0);
//   const [errorLocal, setErrorLocal] = useState<string | null>(null);

//   const handleChunkAvailable = async (blob: Blob) => {
//     try {
//       const buffer = await blob.arrayBuffer();
//       const bytes = new Uint8Array(buffer);
//       if (bytes.length === 0) return;
      
//       const binaryString = Array.from(bytes).map(byte => String.fromCharCode(byte)).join("");
//       const chunkBase64 = btoa(binaryString);

//       const seq = sequenceRef.current++;
//       const payload = {
//         callId,
//         sequence: seq,
//         chunkBase64,
//         audioUrl: null,
//         sentAtUtc: new Date().toISOString()
//       };
      
//       const res = await api.post("/stream/audio-chunk", payload);
//       if (res.data?.success) {
//         setChunksSent(seq); 
//         setErrorLocal(null); 
//       } else {
//         console.error("Chunk rejected:", res.data);
//       }
//     } catch (err: any) {
//       // console.error("Failed to push chunk:", err);
//       setErrorLocal("Warning: A chunk failed to synchronize with the server. Recording continues.");
//     }
//   };

//   const { startRecording, stopRecording, isRecording, elapsedSeconds, error } = useAudioRecorder({
//     onChunkAvailable: handleChunkAvailable,
//     timeslice: 2000
//   });

//   useEffect(() => {
//     startRecording();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleStop = async () => {
//     const fullAudioBlob = await stopRecording();
//     if (fullAudioBlob) {
//       onStop(fullAudioBlob);
//     }
//   };

//   const formatSeconds = (sec: number) => {
//     const min = Math.floor(sec / 60);
//     const s = sec % 60;
//     return `${min.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
//   };

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
//       <Card sx={{ minWidth: 400, textAlign: 'center', p: 2 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom color="primary">
//             Call Active
//           </Typography>
//           <Typography variant="body2" color="text.secondary" gutterBottom>
//             ID: {callId}
//           </Typography>

//           <Box my={4} display="flex" flexDirection="column" alignItems="center" gap={2}>
//             {isRecording ? (
//               <Box display="flex" alignItems="center" gap={2}>
//                 <Box
//                   sx={{
//                     width: 12,
//                     height: 12,
//                     borderRadius: '50%',
//                     bgcolor: 'error.main',
//                     animation: 'pulse 1.5s infinite ease-in-out',
//                     '@keyframes pulse': {
//                       '0%': { transform: 'scale(1)', opacity: 1 },
//                       '50%': { transform: 'scale(1.5)', opacity: 0.5 },
//                       '100%': { transform: 'scale(1)', opacity: 1 },
//                     }
//                   }}
//                 />
//                 <Typography variant="h4" color="error.main">
//                   {formatSeconds(elapsedSeconds)}
//                 </Typography>
//               </Box>
//             ) : (
//               <Typography variant="h6">Finishing up...</Typography>
//             )}

//             <Typography variant="body2" color="text.secondary">
//               Chunks Sent: {chunksSent}
//             </Typography>
//           </Box>

//           {(error || errorLocal) && (
//             <Alert severity="warning" sx={{ mb: 3 }}>
//               {error || errorLocal}
//             </Alert>
//           )}

//           <Button 
//             variant="contained" 
//             color="error" 
//             size="large" 
//             onClick={handleStop}
//             disabled={!isRecording}
//             sx={{ px: 4, py: 1.5, borderRadius: 8 }}
//           >
//             Stop & Process
//           </Button>

//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
