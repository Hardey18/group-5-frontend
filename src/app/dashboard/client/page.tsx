"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import { useClientDashboard } from "@/lib/react-query/client.queries";
import { CallHistoryTable } from "@/components/dashboard/client/call-history-table";
import { RequestHistoryTable } from "@/components/dashboard/client/request-history-table";

export default function ClientDashboardPage(): React.JSX.Element {
  const { data: response, isLoading, error } = useClientDashboard();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || (response && !response.success)) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4">Client Dashboard</Typography>
        <Alert severity="error">
          Failed to load dashboard data. {(error as any)?.message || response?.message || "Please log in and try again."}
        </Alert>
      </Stack>
    );
  }

  const { callHistory = [], requestHistory = [] } = response?.data || {};

  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4">Client Dashboard</Typography>
      </div>
      <CallHistoryTable calls={callHistory} />
      <RequestHistoryTable requests={requestHistory} />
    </Stack>
  );
}
