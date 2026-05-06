"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { PhoneCall, User, Warning } from "@phosphor-icons/react";
import { api } from "@/lib/api/axios";
import { useCurrentUser } from "@/lib/react-query/user.queries";
import { D } from "../config/call-design-tokens";
// import { D } from "./call-design-tokens";

interface StartCallCardProps {
  onCallStarted: (callId: string) => void;
}

export function StartCallCard({ onCallStarted }: StartCallCardProps) {
  const [userId, setUserId] = useState<string>("Unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useCurrentUser();

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.id) setUserId(u.id);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleStartCall = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = { clientId: user?.userId };
      const res = await api.post("/Call/start", payload);
      if (res.data && res.data.success) {
        onCallStarted(res.data.data.id);
      } else {
        throw new Error(res.data?.message || "Failed to start call");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while starting the call.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 0,
      }}
    >
      {/* Card */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          bgcolor: D.surface,
          border: `1px solid ${D.border}`,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: `0 32px 80px #00000050`,
        }}
      >
        {/* Top accent bar */}
        <Box sx={{ height: 3, background: `linear-gradient(90deg, ${D.green}, ${D.teal} 60%, transparent)` }} />

        <Box sx={{ p: 4 }}>
          {/* Icon orb */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3.5 }}>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 35%, ${D.green}28, ${D.teal}14)`,
                  border: `1.5px solid ${D.green}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PhoneCall size={32} color={D.green} weight="fill" />
              </Box>
              {/* Pulse rings */}
              {[1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: `1px solid ${D.green}`,
                    animation: "ring 2.5s ease-out infinite",
                    animationDelay: `${i * 0.9}s`,
                    "@keyframes ring": {
                      "0%": { transform: "scale(1)", opacity: 0.5 },
                      "100%": { transform: "scale(2)", opacity: 0 },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Text */}
          <Typography
            sx={{
              color: D.text,
              fontWeight: 800,
              fontSize: "1.35rem",
              textAlign: "center",
              letterSpacing: "-0.02em",
              mb: 0.75,
            }}
          >
            Start a New Call
          </Typography>
          <Typography sx={{ color: D.textMuted, fontSize: "0.8rem", textAlign: "center", mb: 3.5 }}>
            Your complaint will be recorded and processed by AI
          </Typography>

          {/* User ID tag */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: D.surfaceAlt,
              border: `1px solid ${D.border}`,
              borderRadius: "10px",
              px: 2,
              py: 1.25,
              mb: 3,
            }}
          >
            <User size={14} color={D.textMuted} weight="fill" />
            <Typography sx={{ color: D.textMuted, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em" }}>
              USER ID
            </Typography>
            <Typography sx={{ color: D.teal, fontSize: "0.78rem", fontWeight: 700, ml: "auto", fontFamily: "monospace" }}>
              {userId}
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
                bgcolor: `${D.rose}12`,
                border: `1px solid ${D.rose}33`,
                borderRadius: "10px",
                px: 2,
                py: 1.5,
                mb: 2.5,
              }}
            >
              <Warning size={16} color={D.rose} weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
              <Typography sx={{ color: D.rose, fontSize: "0.78rem", lineHeight: 1.5 }}>{error}</Typography>
            </Box>
          )}

          {/* CTA Button */}
          <Box
            component="button"
            onClick={handleStartCall}
            disabled={loading}
            sx={{
              width: "100%",
              py: 1.75,
              borderRadius: "12px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: loading
                ? D.surfaceAlt
                : `linear-gradient(135deg, ${D.green}, #16a34a)`,
              color: loading ? D.textMuted : "#fff",
              fontSize: "0.92rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s",
              boxShadow: loading ? "none" : `0 8px 24px ${D.green}30`,
              "&:hover:not(:disabled)": {
                transform: "translateY(-2px)",
                boxShadow: `0 12px 32px ${D.green}40`,
              },
              "&:active:not(:disabled)": { transform: "translateY(0)" },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={18} sx={{ color: D.textMuted }} />
                <span>Connecting…</span>
              </>
            ) : (
              <>
                <PhoneCall size={18} weight="fill" />
                <span>Start Call</span>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Typography sx={{ color: D.textFaint, fontSize: "0.68rem", mt: 2.5, letterSpacing: "0.06em" }}>
        Your call will be encrypted and processed securely
      </Typography>
    </Box>
  );
}






// "use client";

// import React, { useState, useEffect } from "react";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import CircularProgress from "@mui/material/CircularProgress";
// import Box from "@mui/material/Box";
// import Alert from "@mui/material/Alert";
// import { api } from "@/lib/api/axios";
// import { useCurrentUser } from "@/lib/react-query/user.queries";

// interface StartCallCardProps {
//   onCallStarted: (callId: string) => void;
// }

// export function StartCallCard({ onCallStarted }: StartCallCardProps) {
//   const [userId, setUserId] = useState<string>("Unknown");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const { data: user } = useCurrentUser();

//   useEffect(() => {
//     try {
//       const userStr = localStorage.getItem("user");
//       if (userStr) {
//         const u = JSON.parse(userStr);
//         if (u.id) setUserId(u.id);
//       }
//     } catch {
//       // ignore parse errors
//     }
//   }, []);

//   const handleStartCall = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const payload = { clientId: user?.userId };
//       const res = await api.post("/Call/start", payload);
      
//       if (res.data && res.data.success) {
//         onCallStarted(res.data.data.id);
//       } else {
//         throw new Error(res.data?.message || "Failed to start call");
//       }
//     } catch (err: any) {
//       setError(err.message || "An error occurred while starting the call.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
//       <Card sx={{ minWidth: 350, textAlign: 'center', p: 2 }}>
//         <CardContent>
//           <Typography variant="h5" gutterBottom>
//             Start a New Call
//           </Typography>
//           <Typography color="text.secondary" gutterBottom>
//             Your ID: {userId}
//           </Typography>
          
//           {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}

//           <Box mt={4}>
//             <Button 
//               variant="contained" 
//               color="success" 
//               size="large" 
//               onClick={handleStartCall}
//               disabled={loading}
//               sx={{ py: 1.5, px: 4, borderRadius: 8 }}
//             >
//               {loading ? <CircularProgress size={24} color="inherit" /> : "Start Call"}
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
