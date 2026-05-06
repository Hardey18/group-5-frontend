"use client";

import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { PlayCircle, SpeakerHigh, ArrowsCounterClockwise } from "@phosphor-icons/react";
import { D } from "../config/call-design-tokens";
// import { D } from "./call-design-tokens";

interface AudioPlayerProps {
  pidginBase64: string;
  englishBase64: string;
}

type Track = "pidgin" | "english";

export function AudioPlayer({ pidginBase64, englishBase64 }: AudioPlayerProps) {
  const [currentPlaying, setCurrentPlaying] = useState<Track | null>(null);
  const [progress, setProgress] = useState<Record<Track, number>>({ pidgin: 0, english: 0 });
  const pidginAudioRef = useRef<HTMLAudioElement | null>(null);
  const englishAudioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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

    const startProgressTracking = (track: Track) => {
      const audio = track === "pidgin" ? pidginAudio : englishAudio;
      if (progressInterval.current) clearInterval(progressInterval.current);
      progressInterval.current = setInterval(() => {
        if (audio.duration) {
          setProgress((p) => ({ ...p, [track]: (audio.currentTime / audio.duration) * 100 }));
        }
      }, 100);
    };

    pidginAudio.onplay = () => { setCurrentPlaying("pidgin"); startProgressTracking("pidgin"); };
    pidginAudio.onended = () => {
      setCurrentPlaying(null);
      setProgress((p) => ({ ...p, pidgin: 100 }));
      if (progressInterval.current) clearInterval(progressInterval.current);
      englishAudio.play().catch(console.error);
    };

    englishAudio.onplay = () => { setCurrentPlaying("english"); startProgressTracking("english"); };
    englishAudio.onended = () => {
      setCurrentPlaying(null);
      setProgress((p) => ({ ...p, english: 100 }));
      if (progressInterval.current) clearInterval(progressInterval.current);
    };

    pidginAudio.play().catch(console.error);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      pidginAudio.pause();
      englishAudio.pause();
      URL.revokeObjectURL(pidginUrl);
      URL.revokeObjectURL(englishUrl);
    };
  }, [pidginBase64, englishBase64]);

  const replay = (type: Track) => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (pidginAudioRef.current) pidginAudioRef.current.pause();
    if (englishAudioRef.current) englishAudioRef.current.pause();
    setCurrentPlaying(null);
    const target = type === "pidgin" ? pidginAudioRef.current : englishAudioRef.current;
    if (target) {
      target.currentTime = 0;
      setProgress((p) => ({ ...p, [type]: 0 }));
      target.play().catch(console.error);
    }
  };

  const tracks: { key: Track; label: string; sublabel: string; color: string }[] = [
    { key: "pidgin", label: "Nigerian Pidgin", sublabel: "Localised response", color: D.teal },
    { key: "english", label: "Formal English", sublabel: "Standard response", color: D.indigo },
  ];

  return (
    <Stack spacing={2}>
      {/* Now playing banner */}
      {currentPlaying && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            bgcolor: `${D.teal}10`,
            border: `1px solid ${D.teal}30`,
            borderRadius: "10px",
            px: 2,
            py: 1.25,
            animation: "fadeIn 0.3s ease",
            "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "3px",
              alignItems: "center",
              height: 16,
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 2.5,
                  borderRadius: 2,
                  bgcolor: D.teal,
                  height: "100%",
                  animation: "eq 0.6s ease-in-out infinite alternate",
                  animationDelay: `${i * 0.12}s`,
                  "@keyframes eq": {
                    from: { height: "30%" },
                    to: { height: "100%" },
                  },
                }}
              />
            ))}
          </Box>
          <SpeakerHigh size={14} color={D.teal} weight="fill" />
          <Typography sx={{ color: D.teal, fontSize: "0.75rem", fontWeight: 600 }}>
            Playing {currentPlaying === "pidgin" ? "Nigerian Pidgin" : "Formal English"} response…
          </Typography>
        </Box>
      )}

      {/* Track cards */}
      {tracks.map((track) => {
        const isPlaying = currentPlaying === track.key;
        const prog = progress[track.key];

        return (
          <Box
            key={track.key}
            sx={{
              bgcolor: D.surfaceAlt,
              border: `1px solid ${isPlaying ? track.color + "44" : D.border}`,
              borderRadius: "12px",
              p: 2,
              transition: "border-color 0.3s, box-shadow 0.3s",
              boxShadow: isPlaying ? `0 0 0 1px ${track.color}22, 0 8px 24px ${track.color}15` : "none",
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Box>
                <Typography sx={{ color: D.text, fontWeight: 700, fontSize: "0.85rem" }}>
                  {track.label}
                </Typography>
                <Typography sx={{ color: D.textMuted, fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.06em" }}>
                  {track.sublabel}
                </Typography>
              </Box>

              <Box
                component="button"
                onClick={() => replay(track.key)}
                disabled={isPlaying}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: "8px",
                  border: `1px solid ${isPlaying ? track.color + "44" : D.border}`,
                  bgcolor: isPlaying ? `${track.color}15` : D.surface,
                  color: isPlaying ? track.color : D.textMuted,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  fontFamily: "inherit",
                  cursor: isPlaying ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  "&:hover:not(:disabled)": {
                    bgcolor: `${track.color}15`,
                    color: track.color,
                    borderColor: `${track.color}50`,
                  },
                }}
              >
                {isPlaying ? (
                  <SpeakerHigh size={13} weight="fill" />
                ) : (
                  prog > 0 ? <ArrowsCounterClockwise size={13} weight="bold" /> : <PlayCircle size={13} weight="fill" />
                )}
                <span>{isPlaying ? "Playing" : prog > 0 ? "Replay" : "Play"}</span>
              </Box>
            </Stack>

            {/* Progress track */}
            <Box sx={{ height: 3, bgcolor: D.border, borderRadius: 4, overflow: "hidden" }}>
              <Box
                sx={{
                  height: "100%",
                  width: `${prog}%`,
                  bgcolor: track.color,
                  borderRadius: 4,
                  transition: prog === 0 ? "none" : "width 0.1s linear",
                  boxShadow: isPlaying ? `0 0 8px ${track.color}60` : "none",
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}






// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import CircularProgress from "@mui/material/CircularProgress";
// import { PlayCircle as PlayCircleIcon } from "@phosphor-icons/react/dist/ssr/PlayCircle";

// interface AudioPlayerProps {
//   pidginBase64: string;
//   englishBase64: string;
// }

// export function AudioPlayer({ pidginBase64, englishBase64 }: AudioPlayerProps) {
//   const [currentPlaying, setCurrentPlaying] = useState<"pidgin" | "english" | null>(null);
//   const pidginAudioRef = useRef<HTMLAudioElement | null>(null);
//   const englishAudioRef = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     const createAudioUrl = (base64: string) => {
//       try {
//         const bytes = atob(base64);
//         const buffer = new Uint8Array(bytes.length).map((_, i) => bytes.charCodeAt(i));
//         const blob = new Blob([buffer], { type: "audio/mpeg" });
//         return URL.createObjectURL(blob);
//       } catch (err) {
//         console.error("Audio decoding failed", err);
//         return "";
//       }
//     };

//     const pidginUrl = createAudioUrl(pidginBase64);
//     const englishUrl = createAudioUrl(englishBase64);

//     pidginAudioRef.current = new Audio(pidginUrl);
//     englishAudioRef.current = new Audio(englishUrl);

//     const pidginAudio = pidginAudioRef.current;
//     const englishAudio = englishAudioRef.current;

//     pidginAudio.onplay = () => setCurrentPlaying("pidgin");
//     pidginAudio.onended = () => {
//       setCurrentPlaying(null);
//       englishAudio.play().catch(console.error);
//     };

//     englishAudio.onplay = () => setCurrentPlaying("english");
//     englishAudio.onended = () => setCurrentPlaying(null);

//     // Start auto-play sequence
//     pidginAudio.play().catch(console.error);

//     return () => {
//       pidginAudio.pause();
//       englishAudio.pause();
//       URL.revokeObjectURL(pidginUrl);
//       URL.revokeObjectURL(englishUrl);
//     };
//   }, [pidginBase64, englishBase64]);

//   const replay = (type: "pidgin" | "english") => {
//     if (pidginAudioRef.current) pidginAudioRef.current.pause();
//     if (englishAudioRef.current) englishAudioRef.current.pause();
//     setCurrentPlaying(null);

//     const target = type === "pidgin" ? pidginAudioRef.current : englishAudioRef.current;
//     if (target) {
//       target.currentTime = 0;
//       target.play().catch(console.error);
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//       {currentPlaying && (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <CircularProgress size={24} />
//           <span>🔊 Playing {currentPlaying === "pidgin" ? "Pidgin" : "English"} Response...</span>
//         </Box>
//       )}
//       <Box sx={{ display: 'flex', gap: 2 }}>
//         <Button 
//           variant="outlined" 
//           startIcon={<PlayCircleIcon />}
//           onClick={() => replay("pidgin")}
//           disabled={currentPlaying === "pidgin"}
//         >
//           Replay Pidgin
//         </Button>
//         <Button 
//           variant="outlined" 
//           startIcon={<PlayCircleIcon />}
//           onClick={() => replay("english")}
//           disabled={currentPlaying === "english"}
//         >
//           Replay English
//         </Button>
//       </Box>
//     </Box>
//   );
// }
