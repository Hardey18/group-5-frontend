"use client";

import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { PlayCircle as PlayCircleIcon } from "@phosphor-icons/react/dist/ssr/PlayCircle";

interface AudioPlayerProps {
  pidginBase64: string;
  englishBase64: string;
}

export function AudioPlayer({ pidginBase64, englishBase64 }: AudioPlayerProps) {
  const [currentPlaying, setCurrentPlaying] = useState<"pidgin" | "english" | null>(null);
  const pidginAudioRef = useRef<HTMLAudioElement | null>(null);
  const englishAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const createAudioUrl = (base64: string) => {
      try {
        const bytes = atob(base64);
        const buffer = new Uint8Array(bytes.length).map((_, i) => bytes.charCodeAt(i));
        const blob = new Blob([buffer], { type: "audio/mpeg" });
        return URL.createObjectURL(blob);
      } catch (err) {
        console.error("Audio decoding failed", err);
        return "";
      }
    };

    const pidginUrl = createAudioUrl(pidginBase64);
    const englishUrl = createAudioUrl(englishBase64);

    pidginAudioRef.current = new Audio(pidginUrl);
    englishAudioRef.current = new Audio(englishUrl);

    const pidginAudio = pidginAudioRef.current;
    const englishAudio = englishAudioRef.current;

    pidginAudio.onplay = () => setCurrentPlaying("pidgin");
    pidginAudio.onended = () => {
      setCurrentPlaying(null);
      englishAudio.play().catch(console.error);
    };

    englishAudio.onplay = () => setCurrentPlaying("english");
    englishAudio.onended = () => setCurrentPlaying(null);

    // Start auto-play sequence
    pidginAudio.play().catch(console.error);

    return () => {
      pidginAudio.pause();
      englishAudio.pause();
      URL.revokeObjectURL(pidginUrl);
      URL.revokeObjectURL(englishUrl);
    };
  }, [pidginBase64, englishBase64]);

  const replay = (type: "pidgin" | "english") => {
    if (pidginAudioRef.current) pidginAudioRef.current.pause();
    if (englishAudioRef.current) englishAudioRef.current.pause();
    setCurrentPlaying(null);

    const target = type === "pidgin" ? pidginAudioRef.current : englishAudioRef.current;
    if (target) {
      target.currentTime = 0;
      target.play().catch(console.error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {currentPlaying && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={24} />
          <span>🔊 Playing {currentPlaying === "pidgin" ? "Pidgin" : "English"} Response...</span>
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<PlayCircleIcon />}
          onClick={() => replay("pidgin")}
          disabled={currentPlaying === "pidgin"}
        >
          Replay Pidgin
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<PlayCircleIcon />}
          onClick={() => replay("english")}
          disabled={currentPlaying === "english"}
        >
          Replay English
        </Button>
      </Box>
    </Box>
  );
}
