"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { 
  FileText, Brain, Waveform, ArrowCounterClockwise,
  Tag, Smiley, SmileyAngry, SmileySad, SmileyMeh, SmileyWink
} from "@phosphor-icons/react";
import { AudioPlayer } from "./AudioPlayer";
import { ComplaintPipelineResponse } from "@/types/call-pipeline";
import { D } from "../config/call-design-tokens";
// import { D } from "./call-design-tokens";

interface ResultsPanelProps {
  data: ComplaintPipelineResponse;
  onReset: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  network: D.sky,
  data:    D.teal,
  billing: D.amber,
  call:    D.indigo,
  sim:     D.green,
  other:   D.textMuted,
};

const SENTIMENT_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  positive:   { color: D.green,  icon: <SmileyWink  size={14} weight="fill" /> },
  neutral:    { color: D.sky,    icon: <SmileyMeh   size={14} weight="fill" /> },
  frustrated: { color: D.amber,  icon: <SmileySad   size={14} weight="fill" /> },
  angry:      { color: D.rose,   icon: <SmileyAngry size={14} weight="fill" /> },
};

function SectionCard({
  icon,
  title,
  accent,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        bgcolor: D.surface,
        border: `1px solid ${D.border}`,
        borderRadius: "16px",
        overflow: "hidden",
        transition: "border-color 0.2s",
        "&:hover": { borderColor: accent + "44" },
      }}
    >
      {/* Card header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 2,
          borderBottom: `1px solid ${D.border}`,
          bgcolor: D.surfaceAlt,
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "8px",
            bgcolor: `${accent}18`,
            border: `1px solid ${accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent,
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ color: D.text, fontWeight: 700, fontSize: "0.88rem", letterSpacing: "-0.01em" }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Box>
  );
}

export function ResultsPanel({ data, onReset }: ResultsPanelProps) {
  const { analysis, transcribedText, audioResponseBase64, englishAudioResponseBase64 } = data;

  const catKey = analysis?.category?.toLowerCase() ?? "";
  const sentKey = analysis?.sentiment?.toLowerCase() ?? "";
  const catColor = CATEGORY_COLORS[catKey] ?? D.textMuted;
  const sentCfg = SENTIMENT_CONFIG[sentKey] ?? { color: D.textMuted, icon: <SmileyMeh size={14} /> };

  return (
    <Stack spacing={3}>
      {/* ── Transcription ───────────────────────────────────────────────── */}
      <SectionCard icon={<FileText size={15} weight="fill" />} title="Transcription" accent={D.teal}>
        <Box
          component="textarea"
          readOnly
          value={transcribedText || "No transcription available."}
          sx={{
            width: "100%",
            minHeight: 110,
            p: 2,
            borderRadius: "10px",
            border: `1px solid ${D.border}`,
            bgcolor: D.bg,
            color: D.text,
            resize: "vertical",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: "0.8rem",
            lineHeight: 1.7,
            outline: "none",
            boxSizing: "border-box",
            "&:focus": { borderColor: D.teal + "66" },
          }}
        />
      </SectionCard>

      {/* ── AI Analysis ─────────────────────────────────────────────────── */}
      <SectionCard icon={<Brain size={15} weight="fill" />} title="AI Analysis" accent={D.indigo}>
        {/* Chips */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
          {/* Category */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
              bgcolor: `${catColor}15`,
              border: `1px solid ${catColor}44`,
            }}
          >
            <Tag size={12} color={catColor} weight="fill" />
            <Typography sx={{ color: catColor, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em" }}>
              {(analysis?.category || "Unknown").toUpperCase()}
            </Typography>
          </Box>

          {/* Sentiment */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
              bgcolor: `${sentCfg.color}15`,
              border: `1px solid ${sentCfg.color}44`,
              color: sentCfg.color,
            }}
          >
            {sentCfg.icon}
            <Typography sx={{ color: sentCfg.color, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em" }}>
              {(analysis?.sentiment || "Unknown").toUpperCase()}
            </Typography>
          </Box>
        </Stack>

        {/* Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: D.textMuted, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", mb: 1 }}>
            Summary
          </Typography>
          <Typography sx={{ color: D.text, fontSize: "0.85rem", lineHeight: 1.7 }}>
            {analysis?.summary || "No summary available."}
          </Typography>
        </Box>

        {/* Response columns */}
        <Grid container spacing={2}>
          {[
            {
              label: "Nigerian Pidgin Response",
              content: analysis?.response,
              color: D.teal,
            },
            {
              label: "Formal English Response",
              content: analysis?.english_response,
              color: D.indigo,
            },
          ].map((col) => (
            <Grid key={col.label} size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography sx={{ color: D.textMuted, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", mb: 1 }}>
                  {col.label}
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: D.bg,
                    borderRadius: "10px",
                    borderLeft: `3px solid ${col.color}`,
                    border: `1px solid ${D.border}`,
                    borderLeftColor: col.color,
                  }}
                >
                  <Typography sx={{ color: D.text, fontSize: "0.82rem", lineHeight: 1.7, fontStyle: "italic" }}>
                    {col.content || "No response."}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      {/* ── Audio Playback ───────────────────────────────────────────────── */}
      <SectionCard icon={<Waveform size={15} weight="fill" />} title="Audio Playback" accent={D.teal}>
        <AudioPlayer
          pidginBase64={audioResponseBase64}
          englishBase64={englishAudioResponseBase64}
        />
      </SectionCard>

      {/* ── Reset CTA ───────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
        <Box
          component="button"
          onClick={onReset}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 4,
            py: 1.5,
            borderRadius: "12px",
            border: `1.5px solid ${D.teal}55`,
            bgcolor: `${D.teal}12`,
            color: D.teal,
            fontSize: "0.88rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: `${D.teal}22`,
              borderColor: D.teal,
              transform: "translateY(-2px)",
              boxShadow: `0 8px 24px ${D.teal}25`,
            },
          }}
        >
          <ArrowCounterClockwise size={16} weight="bold" />
          <span>Start New Call</span>
        </Box>
      </Box>
    </Stack>
  );
}









// "use client";

// import React from "react";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardHeader from "@mui/material/CardHeader";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import Chip from "@mui/material/Chip";
// import Grid from "@mui/material/Grid";
// import Button from "@mui/material/Button";
// import { AudioPlayer } from "./AudioPlayer";
// import { ComplaintPipelineResponse } from "@/types/call-pipeline";

// interface ResultsPanelProps {
//   data: ComplaintPipelineResponse;
//   onReset: () => void;
// }

// const CAT_COLORS: Record<string, "primary" | "secondary" | "error" | "info" | "success" | "warning" | "default"> = {
//   network: "info",
//   data: "primary",
//   billing: "warning",
//   call: "secondary",
//   sim: "success",
//   other: "default"
// };

// const SENT_COLORS: Record<string, "success" | "default" | "warning" | "error"> = {
//   positive: "success",
//   neutral: "default",
//   frustrated: "warning",
//   angry: "error"
// };

// export function ResultsPanel({ data, onReset }: ResultsPanelProps) {
//   const { analysis, transcribedText, audioResponseBase64, englishAudioResponseBase64 } = data;

//   return (
//     <Box display="flex" flexDirection="column" gap={4}>
      
//       <Card>
//         <CardHeader title="Transcription" />
//         <Divider />
//         <CardContent>
//           <Box
//             component="textarea"
//             readOnly
//             value={transcribedText || "No transcription available."}
//             sx={{
//               width: "100%",
//               minHeight: 120,
//               p: 2,
//               borderRadius: 1,
//               borderColor: "divider",
//               bgcolor: "action.hover",
//               color: "text.primary",
//               resize: "vertical",
//               fontFamily: "inherit"
//             }}
//           />
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader title="AI Analysis" />
//         <Divider />
//         <CardContent>
//           <Box display="flex" gap={2} mb={3}>
//             <Chip 
//               label={`Category: ${analysis?.category || "Unknown"}`} 
//               color={CAT_COLORS[analysis?.category?.toLowerCase()] || "default"} 
//             />
//             <Chip 
//               label={`Sentiment: ${analysis?.sentiment || "Unknown"}`} 
//               color={SENT_COLORS[analysis?.sentiment?.toLowerCase()] || "default"} 
//             />
//           </Box>

//           <Typography variant="subtitle1" gutterBottom fontWeight={600}>
//             Summary
//           </Typography>
//           <Typography variant="body1" paragraph color="text.secondary">
//             {analysis?.summary || "No summary available."}
//           </Typography>

//           <Grid container spacing={4} mt={1}>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography variant="subtitle2" gutterBottom>Nigerian Pidgin Response</Typography>
//               <Box 
//                 sx={{ 
//                   p: 2, 
//                   bgcolor: "var(--mui-palette-success-light)", 
//                   color: "var(--mui-palette-success-dark)",
//                   borderRadius: 2,
//                   fontStyle: "italic",
//                   borderLeft: "4px solid var(--mui-palette-success-main)"
//                 }}
//               >
//                 {analysis?.response || "No response."}
//               </Box>
//             </Grid>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography variant="subtitle2" gutterBottom>Formal English Response</Typography>
//               <Box 
//                 sx={{ 
//                   p: 2, 
//                   bgcolor: "var(--mui-palette-info-light)", 
//                   color: "var(--mui-palette-info-dark)",
//                   borderRadius: 2,
//                   fontStyle: "italic",
//                   borderLeft: "4px solid var(--mui-palette-info-main)"
//                 }}
//               >
//                 {analysis?.english_response || "No response."}
//               </Box>
//             </Grid>
//           </Grid>

//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader title="Audio Playback" />
//         <Divider />
//         <CardContent>
//           <AudioPlayer 
//             pidginBase64={audioResponseBase64} 
//             englishBase64={englishAudioResponseBase64} 
//           />
//         </CardContent>
//       </Card>

//       <Box display="flex" justifyContent="center" mt={2}>
//         <Button variant="contained" size="large" onClick={onReset} sx={{ borderRadius: 8, px: 4 }}>
//           Start New Call
//         </Button>
//       </Box>

//     </Box>
//   );
// }
