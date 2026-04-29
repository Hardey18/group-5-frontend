"use client";

import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { LoadingButton } from "@mui/lab";

import { MessageTypeToggle } from "./MessageTypeToggle";
import { useFollowUp } from "../hooks/useFollowUp";

export function GenerateStep({ hook }: { hook: ReturnType<typeof useFollowUp> }) {
  const [dirty, setDirty] = useState(false);
  const showError = dirty && !hook.callId.trim();

  const handleGenerate = () => {
    setDirty(true);
    if (hook.callId.trim()) {
      hook.generateFollowUp();
    }
  };

  return (
    <Card>
      <CardHeader 
        title="Generate Follow-Up Message" 
        subheader="AI will draft a message based on the call." 
      />
      <CardContent>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField 
            label="Call ID" 
            fullWidth 
            required
            value={hook.callId}
            onChange={(e) => hook.setCallId(e.target.value)}
            error={showError}
            helperText={showError ? "Call ID is required." : ""}
            placeholder="e.g. 123e4567-e89b-12d3..."
          />
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Message Delivery Type
            </Typography>
            <MessageTypeToggle 
              value={hook.messageType} 
              onChange={hook.setMessageType} 
            />
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, flexDirection: 'column', gap: 2 }}>
        <LoadingButton
          variant="contained"
          fullWidth
          size="large"
          loading={hook.isGenerating}
          onClick={handleGenerate}
        >
          Generate Message
        </LoadingButton>

        {hook.error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {hook.error}
          </Alert>
        )}
      </CardActions>
    </Card>
  );
}
