"use client";

import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { AudioPlayer } from "./AudioPlayer";
import { ComplaintPipelineResponse } from "@/types/call-pipeline";

interface ResultsPanelProps {
  data: ComplaintPipelineResponse;
  onReset: () => void;
}

const CAT_COLORS: Record<string, "primary" | "secondary" | "error" | "info" | "success" | "warning" | "default"> = {
  network: "info",
  data: "primary",
  billing: "warning",
  call: "secondary",
  sim: "success",
  other: "default"
};

const SENT_COLORS: Record<string, "success" | "default" | "warning" | "error"> = {
  positive: "success",
  neutral: "default",
  frustrated: "warning",
  angry: "error"
};

export function ResultsPanel({ data, onReset }: ResultsPanelProps) {
  const { analysis, transcribedText, audioResponseBase64, englishAudioResponseBase64 } = data;

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      
      <Card>
        <CardHeader title="Transcription" />
        <Divider />
        <CardContent>
          <Box
            component="textarea"
            readOnly
            value={transcribedText || "No transcription available."}
            sx={{
              width: "100%",
              minHeight: 120,
              p: 2,
              borderRadius: 1,
              borderColor: "divider",
              bgcolor: "action.hover",
              color: "text.primary",
              resize: "vertical",
              fontFamily: "inherit"
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="AI Analysis" />
        <Divider />
        <CardContent>
          <Box display="flex" gap={2} mb={3}>
            <Chip 
              label={`Category: ${analysis?.category || "Unknown"}`} 
              color={CAT_COLORS[analysis?.category?.toLowerCase()] || "default"} 
            />
            <Chip 
              label={`Sentiment: ${analysis?.sentiment || "Unknown"}`} 
              color={SENT_COLORS[analysis?.sentiment?.toLowerCase()] || "default"} 
            />
          </Box>

          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Summary
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            {analysis?.summary || "No summary available."}
          </Typography>

          <Grid container spacing={4} mt={1}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" gutterBottom>Nigerian Pidgin Response</Typography>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: "var(--mui-palette-success-light)", 
                  color: "var(--mui-palette-success-dark)",
                  borderRadius: 2,
                  fontStyle: "italic",
                  borderLeft: "4px solid var(--mui-palette-success-main)"
                }}
              >
                {analysis?.response || "No response."}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" gutterBottom>Formal English Response</Typography>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: "var(--mui-palette-info-light)", 
                  color: "var(--mui-palette-info-dark)",
                  borderRadius: 2,
                  fontStyle: "italic",
                  borderLeft: "4px solid var(--mui-palette-info-main)"
                }}
              >
                {analysis?.english_response || "No response."}
              </Box>
            </Grid>
          </Grid>

        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Audio Playback" />
        <Divider />
        <CardContent>
          <AudioPlayer 
            pidginBase64={audioResponseBase64} 
            englishBase64={englishAudioResponseBase64} 
          />
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="contained" size="large" onClick={onReset} sx={{ borderRadius: 8, px: 4 }}>
          Start New Call
        </Button>
      </Box>

    </Box>
  );
}
