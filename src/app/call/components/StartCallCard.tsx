"use client";

import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { api } from "@/lib/api/axios";

interface StartCallCardProps {
  onCallStarted: (callId: string) => void;
}

export function StartCallCard({ onCallStarted }: StartCallCardProps) {
  const [userId, setUserId] = useState<string>("Unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const payload = { clientId: userId === "Unknown" ? "00000000-0000-0000-0000-000000000000" : userId };
      const res = await api.post("/call/start", payload);
      
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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <Card sx={{ minWidth: 350, textAlign: 'center', p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Start a New Call
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Your ID: {userId}
          </Typography>
          
          {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}

          <Box mt={4}>
            <Button 
              variant="contained" 
              color="success" 
              size="large" 
              onClick={handleStartCall}
              disabled={loading}
              sx={{ py: 1.5, px: 4, borderRadius: 8 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Start Call"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
