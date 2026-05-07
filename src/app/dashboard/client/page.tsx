"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import { PhoneCall, ChatText, CheckCircle, ClockCountdown } from "@phosphor-icons/react";
import { useClientDashboard } from "@/lib/react-query/client.queries";
import { CallHistoryTable } from "@/components/dashboard/client/call-history-table";
import { RequestHistoryTable } from "@/components/dashboard/client/request-history-table";
import { D } from "./config/client-design-tokens";
import { M } from "@/config/mtn-tokens";

// ─── Mini stat card ────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Box
      sx={{
        bgcolor: D.surface,
        border: `1px solid ${D.border}`,
        borderTop: `2px solid ${color}`,
        borderRadius: "14px",
        p: "18px 20px",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `0 12px 32px ${color}14`,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -16,
          right: -16,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography sx={{ color: D.textMuted, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", mb: 0.75 }}>
            {label}
          </Typography>
          <Typography sx={{ color: D.text, fontSize: "1.8rem", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            bgcolor: `${color}18`,
            border: `1px solid ${color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Box>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ClientDashboardPage(): React.JSX.Element {
  const { data: response, isLoading, error } = useClientDashboard();

  const { callHistory = [], requestHistory = [] } = response?.data || {};

  const resolvedCalls = callHistory.filter((c) => c.isResolved).length;
  const pendingRequests = requestHistory.filter(
    (r) => !["resolved", "completed"].includes(r.status?.toLowerCase() ?? "")
  ).length;

  // ── Loading ──
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: D.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          fontFamily: "'Outfit', 'Nunito', sans-serif",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CircularProgress
            size={48}
            thickness={2}
            sx={{ color: D.teal }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhoneCall size={18} color={D.teal} weight="fill" />
          </Box>
        </Box>
        <Typography sx={{ color: D.textMuted, fontSize: "0.8rem" }}>
          Loading your dashboard…
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: D.bg,
        fontFamily: "'Outfit', 'Nunito', sans-serif",
        backgroundImage: `
          radial-gradient(ellipse 60% 35% at 15% 0%, #00C9B108 0%, transparent 55%),
          radial-gradient(ellipse 40% 25% at 85% 100%, #818CF808 0%, transparent 50%)
        `,
      }}
    >
      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <Box
        sx={{
          borderBottom: `1px solid ${D.border}`,
          px: { xs: 3, md: 5 },
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          bgcolor: `${D.bg}D8`,
          backdropFilter: "blur(14px)",
        }}
      >
        {/* <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${D.teal}22, ${D.indigo}22)`,
              border: `1px solid ${D.teal}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhoneCall size={16} color={D.teal} weight="fill" />
          </Box>
          <Box>
            <Typography sx={{ color: D.text, fontWeight: 800, fontSize: "1rem", lineHeight: 1, letterSpacing: "-0.01em" }}>
              Client Dashboard
            </Typography>
            <Typography sx={{ color: D.textMuted, fontSize: "0.62rem", letterSpacing: "0.12em" }}>
              YOUR HISTORY & REQUESTS
            </Typography>
          </Box>
        </Stack> */}

        <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ width: 5, bgcolor: M.yellow, alignSelf: "stretch" }} />
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 2 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "9px",
                        bgcolor: M.yellow,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PhoneCall sx={{ color: M.black, fontSize: "1.15rem" }} />
                    </Box>
                    <Box>
                      <Typography
                        sx={{ fontWeight: 800, fontSize: "1rem", color: M.black, lineHeight: 1, letterSpacing: "-0.01em" }}
                      >
                        Client Dashboard
                      </Typography>
                      <Typography sx={{ color: M.textMuted, fontSize: "0.6rem", letterSpacing: "0.12em" }}>
                        YOUR HISTORY & REQUESTS
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

        {/* Error banner in header */}
        {(error || (response && !response.success)) && (
          <Box
            sx={{
              px: 2,
              py: 0.75,
              bgcolor: `${D.rose}15`,
              border: `1px solid ${D.rose}33`,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: D.rose }} />
            <Typography sx={{ color: D.rose, fontSize: "0.72rem", fontWeight: 600 }}>
              {(error as any)?.message || response?.message || "Failed to load data"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <Fade in timeout={500}>
        <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>

          {/* ── Summary stats ──────────────────────────────────────────────── */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<PhoneCall size={18} weight="fill" />}
                label="Total Calls"
                value={callHistory.length}
                color={D.teal}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<CheckCircle size={18} weight="fill" />}
                label="Calls Resolved"
                value={resolvedCalls}
                color={D.green}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<ChatText size={18} weight="fill" />}
                label="Total Requests"
                value={requestHistory.length}
                color={D.indigo}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<ClockCountdown size={18} weight="fill" />}
                label="Pending Requests"
                value={pendingRequests}
                color={pendingRequests > 0 ? D.amber : D.green}
              />
            </Grid>
          </Grid>

          {/* ── Tables ─────────────────────────────────────────────────────── */}
          <Stack spacing={4}>
            <Box
              sx={{
                animation: "slideUp 0.5s ease both",
                animationDelay: "0.1s",
                "@keyframes slideUp": {
                  from: { opacity: 0, transform: "translateY(20px)" },
                  to: { opacity: 1, transform: "none" },
                },
              }}
            >
              <CallHistoryTable calls={callHistory} />
            </Box>

            <Box
              sx={{
                animation: "slideUp 0.5s ease both",
                animationDelay: "0.2s",
              }}
            >
              <RequestHistoryTable requests={requestHistory} />
            </Box>
          </Stack>

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          <Box
            sx={{
              mt: 5,
              pt: 2.5,
              borderTop: `1px solid ${D.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography sx={{ color: D.textFaint, fontSize: "0.68rem" }}>
              Client Dashboard · Live data
            </Typography>
            <Stack direction="row" spacing={2.5}>
              {[
                { label: "Calls", count: callHistory.length, color: D.teal },
                { label: "Requests", count: requestHistory.length, color: D.indigo },
                { label: "Resolved", count: resolvedCalls, color: D.green },
              ].map((s) => (
                <Stack key={s.label} direction="row" alignItems="center" spacing={0.75}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />
                  <Typography sx={{ color: D.textFaint, fontSize: "0.68rem" }}>
                    {s.label}: <strong style={{ color: s.color }}>{s.count}</strong>
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
}








// "use client";

// import * as React from "react";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import Alert from "@mui/material/Alert";
// import CircularProgress from "@mui/material/CircularProgress";

// import { useClientDashboard } from "@/lib/react-query/client.queries";
// import { CallHistoryTable } from "@/components/dashboard/client/call-history-table";
// import { RequestHistoryTable } from "@/components/dashboard/client/request-history-table";

// export default function ClientDashboardPage(): React.JSX.Element {
//   const { data: response, isLoading, error } = useClientDashboard();

//   if (isLoading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // if (error || (response && !response.success)) {
//   //   return (
//   //     <Stack spacing={3}>
//   //       <Typography variant="h4">Client Dashboard</Typography>
//   //       <Alert severity="error">
//   //         Failed to load dashboard data. {(error as any)?.message || response?.message || "Please log in and try again."}
//   //       </Alert>
//   //     </Stack>
//   //   );
//   // }

//   const { callHistory = [], requestHistory = [] } = response?.data || {};

//   return (
//     <Stack spacing={4}>
//       <div>
//         <Typography variant="h4">Client Dashboard</Typography>
//       </div>
//       <CallHistoryTable calls={callHistory} />
//       <RequestHistoryTable requests={requestHistory} />
//     </Stack>
//   );
// }
