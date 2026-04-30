"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";

import { useFollowUp } from "../hooks/useFollowUp";

export function ApproveStep({ hook }: { hook: ReturnType<typeof useFollowUp> }) {
  const msg = hook.message;
  if (!msg) return null;

  const getChipColor = (type: string | null) => {
    if (type === "SMS") return "primary";
    if (type === "Email") return "secondary";
    if (type === "WhatsApp") return "success";
    return "default";
  };

  return (
    <Card>
      <CardHeader 
        title="Review Generated Message" 
        subheader={
          <Chip 
            label={msg.type || "Unknown"} 
            color={getChipColor(msg.type)} 
            size="small" 
            sx={{ mt: 1 }} 
          />
        }
      />
      <CardContent>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50", mb: 3 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {msg.content || "No content generated."}
          </Typography>
        </Paper>

        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            <strong>Call ID:</strong> {msg.callId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Message ID:</strong> {msg.id}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              <strong>Approved:</strong>
            </Typography>
            <Chip 
              label={msg.isApproved ? "Yes" : "No"} 
              color={msg.isApproved ? "success" : "default"} 
              size="small" 
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              <strong>Delivery Status:</strong>
            </Typography>
            <Chip label={msg.deliveryStatus || "Pending"} size="small" />
          </Stack>
        </Stack>

        {msg.isApproved && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Already approved.
          </Alert>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
        <Button variant="text" onClick={() => hook.setStep(0)}>
          Back
        </Button>
        <LoadingButton
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          loading={hook.isApproving}
          onClick={hook.approveFollowUp}
          disabled={msg.isApproved}
        >
          Approve Message
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
