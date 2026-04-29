"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import dayjs from "dayjs";

import { useFollowUp } from "../hooks/useFollowUp";

export function ResultSummary({ hook }: { hook: ReturnType<typeof useFollowUp> }) {
  const msg = hook.message;
  if (!msg) return null;

  const formattedDate = msg.sentAt ? dayjs(msg.sentAt).format("MMM D, YYYY, h:mm A") : "Pending";

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Follow-Up Successfully Sent!
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Your {msg.type} message has been delivered to the gateway.
        </Typography>

        <Stack alignItems="center" spacing={2} mb={4}>
          <Typography variant="body2">
            <strong>Message ID:</strong> {msg.id}
          </Typography>
          <Typography variant="body2">
            <strong>Sent At:</strong> {formattedDate}
          </Typography>
          <Chip label={msg.deliveryStatus || "Delivered"} color="success" />
        </Stack>
        
        <Button variant="contained" size="large" onClick={hook.reset}>
          Start New Follow-Up
        </Button>
      </CardContent>
    </Card>
  );
}
