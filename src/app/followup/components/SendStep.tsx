"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import { PaperPlaneRight as SendIcon } from "@phosphor-icons/react/dist/ssr/PaperPlaneRight";

import { useFollowUp } from "../hooks/useFollowUp";

export function SendStep({ hook }: { hook: ReturnType<typeof useFollowUp> }) {
  const msg = hook.message;
  if (!msg) return null;

  return (
    <Card>
      <CardHeader 
        title="Send Follow-Up Message" 
        subheader="Message is approved and ready to send." 
      />
      <CardContent>
        <Alert severity="info" sx={{ mb: 3 }}>
           "{msg.content}"
        </Alert>
        
        <Stack direction="row" spacing={2} mb={3}>
           <Chip label={`Type: ${msg.type}`} color="primary" variant="outlined" />
           <Chip label="Approved" color="success" />
        </Stack>
        
        <Alert severity="warning">
           Once sent, this action cannot be undone.
        </Alert>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
        <Button variant="text" onClick={() => hook.setStep(1)}>
          Back
        </Button>
        <LoadingButton
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          loading={hook.isSending}
          onClick={hook.sendFollowUp}
        >
          Send Now
        </LoadingButton>
      </CardActions>
      
      {hook.error && (
        <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
          {hook.error}
        </Alert>
      )}
    </Card>
  );
}
