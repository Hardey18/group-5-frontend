"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Stack,
  CircularProgress,
  Chip,
  Fade,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import TranslateIcon from "@mui/icons-material/Translate";
import { useTextChatMutation } from "@/lib/react-query/chat.mutation";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  altText?: string;
  showAlt?: boolean;
}

// ─── Design tokens ────────────────────────────────────────────────────────────
// Aesthetic: deep-space teal-indigo. Clean, premium, telecom-forward.
// Distinct from both ChurnIQ (blue-dark) and CallPulse (amber-charcoal).
const C = {
  bg: "#fff",
  surface: "#cde3c14c",
  surfaceAlt: "#fff",
  border: "#1A3050",
  borderLight: "#1E3A5F",
  teal: "#00C9B1",
  tealDim: "#00C9B115",
  tealGlow: "#00C9B130",
  indigo: "#818CF8",
  indigoDim: "#818CF818",
  userBubble: "linear-gradient(135deg, #00A896 0%, #007A6E 100%)",
  aiBubble: "#112039",
  aiText: "#fff",
  text: "#050A14",
  textMuted: "#5B8A8A",
  textFaint: "#2A4A4A",
  dot1: "#00C9B1",
  dot2: "#818CF8",
  dot3: "#38BDF8",
};

// ─── Typing dots animation ─────────────────────────────────────────────────────
function TypingDots() {
  return (
    <Stack direction="row" spacing={0.6} alignItems="center" sx={{ px: 0.5, py: 0.25 }}>
      {[C.dot1, C.dot2, C.dot3].map((color, i) => (
        <Box
          key={i}
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            bgcolor: color,
            animation: "bounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
            "@keyframes bounce": {
              "0%, 80%, 100%": { transform: "scale(0.7)", opacity: 0.4 },
              "40%": { transform: "scale(1.1)", opacity: 1 },
            },
          }}
        />
      ))}
    </Stack>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        px: 4,
        animation: "fadeUp 0.6s ease both",
        "@keyframes fadeUp": {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Orb */}
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, #00C9B155, #007A6E22)`,
            border: `1.5px solid ${C.teal}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <SmartToyIcon sx={{ color: C.teal, fontSize: "2rem" }} />
        </Box>
        {/* Pulse rings */}
        {[1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `1px solid ${C.teal}`,
              animation: "ring 2.5s ease-out infinite",
              animationDelay: `${i * 0.8}s`,
              "@keyframes ring": {
                "0%": { transform: "scale(1)", opacity: 0.5 },
                "100%": { transform: "scale(2.2)", opacity: 0 },
              },
            }}
          />
        ))}
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <Typography
          sx={{
            color: C.text,
            fontSize: "1.4rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            mb: 0.75,
          }}
        >
          Sup, I dey here for you
        </Typography>
        <Typography sx={{ color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.6 }}>
          Ask me anything in Pidgin or English —<br />I go reply you sharp sharp.
        </Typography>
      </Box>

      {/* Suggestion chips */}
      <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1} sx={{ mt: 1 }}>
        {["How my data dey?", "Billing wahala", "Network issue", "Talk English"].map((s) => (
          <Chip
            key={s}
            label={s}
            size="small"
            sx={{
              bgcolor: C.tealDim,
              color: C.teal,
              border: `1px solid ${C.teal}30`,
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "default",
              letterSpacing: "0.01em",
              "&:hover": { bgcolor: C.tealGlow },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

// ─── Single message bubble ────────────────────────────────────────────────────
function MessageBubble({
  msg,
  onToggle,
}: {
  msg: Message;
  onToggle: (id: number) => void;
}) {
  const isUser = msg.role === "user";

  return (
    <Fade in timeout={320}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isUser ? "row-reverse" : "row",
          alignItems: "flex-end",
          gap: 1.25,
          animation: "slideIn 0.3s ease both",
          "@keyframes slideIn": {
            from: { opacity: 0, transform: `translateY(10px)` },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            width: 30,
            height: 30,
            flexShrink: 0,
            background: isUser
              ? `linear-gradient(135deg, ${C.teal}, #007A6E)`
              : `linear-gradient(135deg, ${C.indigo}, #4F46E5)`,
            border: `1.5px solid ${isUser ? C.teal : C.indigo}44`,
            "& svg": { fontSize: "0.9rem" },
          }}
        >
          {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
        </Avatar>

        {/* Content */}
        <Box sx={{ maxWidth: "68%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
          {/* Bubble */}
          <Box
            sx={{
              px: 2.25,
              py: 1.5,
              borderRadius: isUser
                ? "18px 18px 4px 18px"
                : "18px 18px 18px 4px",
              background: isUser ? C.userBubble : C.aiBubble,
              border: isUser ? "none" : `1px solid ${C.border}`,
              boxShadow: isUser
                ? `0 4px 24px ${C.teal}20`
                : `0 2px 12px #00000030`,
              position: "relative",
              transition: "box-shadow 0.2s",
            }}
          >
            <Typography
              sx={{
                color: isUser ? "#fff" : C.aiText,
                fontSize: "0.88rem",
                lineHeight: 1.65,
                letterSpacing: "0.01em",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {msg.showAlt ? msg.altText : msg.text}
            </Typography>

            {/* Language badge for AI — inside top-right of bubble */}
            {!isUser && msg.altText && (
              <Box
                sx={{
                  position: "absolute",
                  top: -10,
                  right: 10,
                }}
              >
                <Tooltip title={msg.showAlt ? "Switch to Pidgin" : "Switch to English"} placement="top">
                  <Box
                    onClick={() => onToggle(msg.id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.4,
                      px: 1,
                      py: 0.3,
                      bgcolor: "#fff",
                      border: `1px solid ${C.teal}44`,
                      borderRadius: "20px",
                      cursor: "pointer",
                      transition: "all 0.18s",
                      // "&:hover": {
                      //   bgcolor: C.tealDim,
                      //   borderColor: C.teal,
                      // },
                    }}
                  >
                    <TranslateIcon sx={{ fontSize: "0.65rem", color: C.teal }} />
                    <Typography sx={{ fontSize: "0.6rem", color: C.teal, fontWeight: 700, letterSpacing: "0.06em" }}>
                      {msg.showAlt ? "PIDGIN" : "ENGLISH"}
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useTextChatMutation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isPending]);

  const handleSend = () => {
    if (!input.trim() || isPending) return;

    const userMessage: Message = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    mutate(currentInput, {
      onSuccess: (res) => {
        const aiMessage: Message = {
          id: Date.now() + 1,
          role: "ai",
          text: res.data.response,
          altText: res.data.english_response,
          showAlt: false,
        };
        setMessages((prev) => [...prev, aiMessage]);
      },
    });
  };

  const toggleLanguage = (id: number) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, showAlt: !msg.showAlt } : msg))
    );
  };

  const isEmpty = messages.length === 0;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: C.bg,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Outfit', 'Nunito', sans-serif",
        backgroundImage: `
          radial-gradient(ellipse 60% 40% at 10% 0%, #00C9B108 0%, transparent 50%),
          radial-gradient(ellipse 40% 30% at 90% 100%, #818CF808 0%, transparent 50%)
        `,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${C.border}`,
          bgcolor: `${C.bg}CC`,
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {/* Animated status dot */}
          <Box sx={{ position: "relative", width: 36, height: 36 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${C.teal}22, ${C.indigo}22)`,
                border: `1px solid ${C.teal}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SmartToyIcon sx={{ color: C.teal, fontSize: "1.1rem" }} />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 1,
                right: 1,
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: C.teal,
                border: `1.5px solid ${C.bg}`,
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.4 },
                },
              }}
            />
          </Box>
          <Box>
            <Typography sx={{ color: C.text, fontWeight: 700, fontSize: "0.92rem", lineHeight: 1.1 }}>
              Customer Support
            </Typography>
            <Typography sx={{ color: C.teal, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em" }}>
              {isPending ? "TYPING…" : "ONLINE"}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            size="small"
            label="Pidgin · English"
            icon={<TranslateIcon style={{ fontSize: 12, color: C.indigo }} />}
            sx={{
              bgcolor: C.indigoDim,
              color: C.indigo,
              border: `1px solid ${C.indigo}30`,
              fontSize: "0.65rem",
              fontWeight: 600,
              "& .MuiChip-icon": { ml: 0.75 },
            }}
          />
          <Typography sx={{ color: C.textMuted, fontSize: "0.7rem" }}>
            {messages.length > 0 ? `${messages.length} messages` : ""}
          </Typography>
        </Stack>
      </Box>

      {/* ── Messages area ──────────────────────────────────────────────────── */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          px: { xs: 2, sm: 4, md: 6 },
          py: 3,
          gap: 2.5,
          scrollbarWidth: "thin",
          scrollbarColor: `${C.border} transparent`,
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: C.border, borderRadius: "4px" },
        }}
      >
        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} onToggle={toggleLanguage} />
            ))}
            {isPending && (
              <Fade in>
                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.25 }}>
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      background: `linear-gradient(135deg, ${C.indigo}, #4F46E5)`,
                      border: `1.5px solid ${C.indigo}44`,
                    }}
                  >
                    <SmartToyIcon sx={{ fontSize: "0.9rem" }} />
                  </Avatar>
                  <Box
                    sx={{
                      px: 2.25,
                      py: 1.5,
                      bgcolor: C.aiBubble,
                      border: `1px solid ${C.border}`,
                      borderRadius: "18px 18px 18px 4px",
                    }}
                  >
                    <TypingDots />
                  </Box>
                </Box>
              </Fade>
            )}
          </>
        )}
      </Box>

      {/* ── Input bar ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          py: 2.5,
          borderTop: `1px solid ${C.border}`,
          bgcolor: `${C.bg}CC`,
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            bgcolor: C.surface,
            border: `1.5px solid ${input.trim() ? C.teal + "55" : C.border}`,
            borderRadius: "14px",
            px: 2,
            py: 0.75,
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: input.trim() ? `0 0 0 3px ${C.teal}10` : "none",
          }}
        >
          <TextField
            inputRef={inputRef}
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type in Pidgin or English…"
            variant="standard"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            InputProps={{ disableUnderline: true }}
            sx={{
              "& .MuiInputBase-root": {
                color: C.text,
                fontSize: "0.88rem",
                lineHeight: 1.6,
                fontFamily: "inherit",
              },
              "& .MuiInputBase-input::placeholder": {
                color: C.textMuted,
                opacity: 1,
              },
            }}
          />

          <Tooltip title={isPending ? "Waiting for response…" : "Send (Enter)"}>
            <span>
              <IconButton
                onClick={handleSend}
                disabled={!input.trim() || isPending}
                sx={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  borderRadius: "10px",
                  background: input.trim() && !isPending
                    ? `linear-gradient(135deg, ${C.teal}, #007A6E)`
                    : C.surfaceAlt,
                  border: `1px solid ${input.trim() && !isPending ? C.teal : C.border}`,
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: input.trim() && !isPending ? "scale(1.06)" : "none",
                    boxShadow: input.trim() && !isPending ? `0 4px 16px ${C.teal}30` : "none",
                  },
                  "&.Mui-disabled": { background: C.surfaceAlt },
                }}
              >
                {isPending ? (
                  <CircularProgress size={16} sx={{ color: C.textMuted }} />
                ) : (
                  <SendIcon
                    sx={{
                      fontSize: "1rem",
                      color: input.trim() ? "#fff" : C.textFaint,
                      transform: "rotate(-10deg)",
                      transition: "color 0.2s",
                    }}
                  />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Typography
          sx={{
            color: C.textFaint,
            fontSize: "0.62rem",
            textAlign: "center",
            mt: 1,
            letterSpacing: "0.04em",
          }}
        >
          Enter to send · Shift+Enter for new line
        </Typography>
      </Box>
    </Box>
  );
}












// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Container,
//   Paper,
//   TextField,
//   IconButton,
//   Typography,
//   Avatar,
//   Stack,
//   CircularProgress,
//   Chip,
//   Fade,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import SmartToyIcon from "@mui/icons-material/SmartToy"; // AI Icon
// import PersonIcon from "@mui/icons-material/Person";   // User Icon
// import TranslateIcon from "@mui/icons-material/Translate";
// import { useTextChatMutation } from "@/lib/react-query/chat.mutation";

// interface Message {
//   id: number;
//   role: "user" | "ai";
//   text: string;
//   altText?: string; // For the English translation
//   showAlt?: boolean;
// }

// export default function ChatSection() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const scrollRef = useRef<HTMLDivElement>(null);
  
//   const { mutate, isPending } = useTextChatMutation();

//   // Auto-scroll to bottom
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages, isPending]);

//   const handleSend = () => {
//     if (!input.trim() || isPending) return;

//     const userMessage: Message = {
//       id: Date.now(),
//       role: "user",
//       text: input,
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     const currentInput = input;
//     setInput("");

//     mutate(currentInput, {
//       onSuccess: (res) => {
//         const aiMessage: Message = {
//           id: Date.now() + 1,
//           role: "ai",
//           text: res.data.response, // Default to Pidgin
//           altText: res.data.english_response,
//           showAlt: false,
//         };
//         setMessages((prev) => [...prev, aiMessage]);
//       },
//     });
//   };

//   const toggleLanguage = (id: number) => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.id === id ? { ...msg, showAlt: !msg.showAlt } : msg
//       )
//     );
//   };

//   return (
//     <Container maxWidth="md" sx={{ height: "90vh", py: 4, display: "flex", flexDirection: "column" }}>
//       <Paper
//         elevation={0}
//         sx={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           borderRadius: 4,
//           border: "1px solid",
//           borderColor: "divider",
//           overflow: "hidden",
//           bgcolor: "#f9fafb",
//         }}
//       >
//         {/* Chat Body */}
//         <Box
//           ref={scrollRef}
//           sx={{
//             flex: 1,
//             p: 3,
//             overflowY: "auto",
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//           }}
//         >
//           {messages.length === 0 ? (
//             <Box sx={{ mt: "15%", textAlign: "center", opacity: 0.6 }}>
//               <SmartToyIcon sx={{ fontSize: 60, mb: 2, color: "primary.main" }} />
//               <Typography variant="h5" fontWeight={600}>How can I help you today?</Typography>
//               <Typography>Type a message below to start a conversation.</Typography>
//             </Box>
//           ) : (
//             messages.map((msg) => (
//               <Fade in key={msg.id}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: msg.role === "user" ? "row-reverse" : "row",
//                     alignItems: "flex-end",
//                     gap: 1.5,
//                   }}
//                 >
//                   <Avatar sx={{ bgcolor: msg.role === "user" ? "primary.main" : "secondary.main", width: 32, height: 32 }}>
//                     {msg.role === "user" ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
//                   </Avatar>
                  
//                   <Box sx={{ maxWidth: "70%" }}>
//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 2,
//                         borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
//                         bgcolor: msg.role === "user" ? "primary.main" : "white",
//                         color: msg.role === "user" ? "white" : "text.primary",
//                         border: msg.role === "user" ? "none" : "1px solid #e0e0e0",
//                       }}
//                     >
//                       <Typography variant="body1">
//                         {msg.showAlt ? msg.altText : msg.text}
//                       </Typography>
//                     </Paper>

//                     {msg.role === "ai" && (
//                       <Stack direction="row" alignItems="center" mt={0.5}>
//                         <Chip
//                           size="small"
//                           icon={<TranslateIcon style={{ fontSize: 14 }} />}
//                           label={msg.showAlt ? "Switch to Pidgin" : "Switch to English"}
//                           onClick={() => toggleLanguage(msg.id)}
//                           sx={{ fontSize: "0.65rem", cursor: "pointer" }}
//                           variant="outlined"
//                         />
//                       </Stack>
//                     )}
//                   </Box>
//                 </Box>
//               </Fade>
//             ))
//           )}
//           {isPending && (
//             <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
//               <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>
//                 <SmartToyIcon fontSize="small" />
//               </Avatar>
//               <CircularProgress size={20} thickness={5} />
//             </Box>
//           )}
//         </Box>

//         {/* Input Area */}
//         <Box sx={{ p: 2, bgcolor: "white", borderTop: "1px solid", borderColor: "divider" }}>
//           <Stack direction="row" spacing={1}>
//             <TextField
//               fullWidth
//               placeholder="Type your message..."
//               variant="outlined"
//               size="small"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: 3,
//                   bgcolor: "#f4f4f7",
//                   "& fieldset": { border: "none" },
//                 },
//               }}
//             />
//             <IconButton
//               color="primary"
//               onClick={handleSend}
//               disabled={!input.trim() || isPending}
//               sx={{
//                 bgcolor: "primary.main",
//                 color: "white",
//                 "&:hover": { bgcolor: "primary.dark" },
//                 "&.Mui-disabled": { bgcolor: "#e0e0e0" },
//                 borderRadius: 2,
//               }}
//             >
//               <SendIcon />
//             </IconButton>
//           </Stack>
//         </Box>
//       </Paper>
//     </Container>
//   );
// }