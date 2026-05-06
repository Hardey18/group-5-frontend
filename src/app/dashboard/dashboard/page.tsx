"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  LinearProgress,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Fade,
  Stack,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import RefreshIcon from "@mui/icons-material/Refresh";
import PeopleIcon from "@mui/icons-material/People";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import FiberSmartRecordIcon from "@mui/icons-material/FiberSmartRecord";
import { useDashboardData } from "@/lib/react-query/insight-analysis.queries";
// import { useDashboardData } from "@/queries/insight-analysis.queries";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Prediction {
  id: number;
  customerId: number;
  avgDataUsage: number;
  usageChangePct: number;
  rechargeFreq: number;
  rechargeChangePct: number;
  engagementScore: number;
  networkQuality: number;
  hasComplaint: number;
  complaintText: string;
  churn: number;
  churnRiskScore: number;
  customerType: string;
  timestamp: string;
}

// ─── Palette & Theme Constants ────────────────────────────────────────────────
const PALETTE = {
  bg: "#fff",
  surface: "#cde3c14c",
  surfaceAlt: "#fff",
  border: "#1A2E50",
  accent: "#00D4FF",
  accentSoft: "#00A3C4",
  success: "#00E5A0",
  warning: "#FFB547",
  danger: "#FF4D6A",
  purple: "#A855F7",
  text: "#050A14",
  textMuted: "#6B8CAE",
};

const SEGMENT_COLORS: Record<string, string> = {
  Healthy: PALETTE.success,
  "Silent Churn": PALETTE.warning,
  "Vocal Churn": PALETTE.danger,
};

const RISK_COLORS = {
  low: PALETTE.success,
  medium: PALETTE.warning,
  high: PALETTE.danger,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getAIAction = (p: Prediction): string => {
  if (p.churnRiskScore > 0.7 && p.hasComplaint === 1) return "Reactive";
  if (p.churnRiskScore > 0.7 && p.hasComplaint === 0) return "Proactive";
  return "Monitor";
};

const getRiskLevel = (score: number): "low" | "medium" | "high" => {
  if (score < 0.3) return "low";
  if (score <= 0.6) return "medium";
  return "high";
};

const fmt = (n: number, dec = 2) => n.toFixed(dec);
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  pulse,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  pulse?: boolean;
}) {
  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${PALETTE.surface} 0%, ${PALETTE.surfaceAlt} 100%)`,
        border: `1px solid ${PALETTE.border}`,
        borderTop: `2px solid ${color}`,
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 40px ${color}22`,
        },
      }}
    >
      {/* Glow blob */}
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography sx={{ color: PALETTE.textMuted, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", mb: 0.5 }}>
              {label}
            </Typography>
            <Typography sx={{ color: PALETTE.text, fontSize: "2rem", fontWeight: 800, lineHeight: 1.1 }}>
              {value}
            </Typography>
            {sub && (
              <Typography sx={{ color: PALETTE.textMuted, fontSize: "0.75rem", mt: 0.5 }}>
                {sub}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}18`,
              border: `1.5px solid ${color}55`,
              width: 48,
              height: 48,
              position: "relative",
            }}
          >
            {pulse && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `2px solid ${color}`,
                  animation: "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  "@keyframes pulse-ring": {
                    "0%": { transform: "scale(1)", opacity: 0.6 },
                    "100%": { transform: "scale(1.6)", opacity: 0 },
                  },
                }}
              />
            )}
            <Box sx={{ color, "& svg": { fontSize: "1.4rem" } }}>{icon}</Box>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
      <Box sx={{ width: 3, height: 22, bgcolor: PALETTE.accent, borderRadius: 4 }} />
      <Typography sx={{ color: PALETTE.text, fontWeight: 700, fontSize: "1rem", letterSpacing: "0.02em" }}>
        {children}
      </Typography>
    </Box>
  );
}

const ChartCard = ({ title, children, height = 280 }: { title: string; children: React.ReactNode; height?: number }) => (
  <Card
    sx={{
      background: `linear-gradient(160deg, ${PALETTE.surface} 0%, ${PALETTE.surfaceAlt} 100%)`,
      border: `1px solid ${PALETTE.border}`,
      borderRadius: "16px",
      p: 3,
      height: "100%",
    }}
  >
    <Typography sx={{ color: PALETTE.textMuted, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", mb: 2.5 }}>
      {title}
    </Typography>
    <Box sx={{ height }}>{children}</Box>
  </Card>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function ChurnDashboard() {
  const [segment, setSegment] = useState("All Customers");
  const [riskFilter, setRiskFilter] = useState("All risk levels");
  const [page] = useState(1);
  const [pageSize] = useState(100); // fetch all for analytics

  const { data, isLoading, isError, dataUpdatedAt, refetch, isFetching } = useDashboardData(page, pageSize);

  const predictions: Prediction[] = useMemo(() => data?.predictions ?? [], [data]);

  // ── Filter logic ──
  const filtered = useMemo(() => {
    return predictions.filter((p) => {
      const segOk =
        segment === "All Customers" ? true : p.customerType === segment;
      const risk = getRiskLevel(p.churnRiskScore);
      const riskOk =
        riskFilter === "All risk levels"
          ? true
          : riskFilter === "Low (< 0.3)"
          ? risk === "low"
          : riskFilter === "Medium (0.3 - 0.6)"
          ? risk === "medium"
          : risk === "high";
      return segOk && riskOk;
    });
  }, [predictions, segment, riskFilter]);

  // ── Computed analytics ──
  const analytics = useMemo(() => {
    const total = filtered.length;
    const churned = filtered.filter((p) => p.churn === 1).length;
    const withComplaints = filtered.filter((p) => p.hasComplaint === 1).length;
    const reactive = filtered.filter((p) => getAIAction(p) === "Reactive").length;
    const proactive = filtered.filter((p) => getAIAction(p) === "Proactive").length;
    const avgRisk = total ? filtered.reduce((s, p) => s + p.churnRiskScore, 0) / total : 0;
    const avgEngagement = total ? filtered.reduce((s, p) => s + p.engagementScore, 0) / total : 0;
    const avgNetwork = total ? filtered.reduce((s, p) => s + p.networkQuality, 0) / total : 0;
    const avgDataUsage = total ? filtered.reduce((s, p) => s + p.avgDataUsage, 0) / total : 0;

    const segmentDist = ["Healthy", "Silent Churn", "Vocal Churn"].map((seg) => ({
      name: seg,
      value: filtered.filter((p) => p.customerType === seg).length,
      color: SEGMENT_COLORS[seg],
    }));

    const riskDist = [
      { name: "Low (<0.3)", value: filtered.filter((p) => getRiskLevel(p.churnRiskScore) === "low").length, color: PALETTE.success },
      { name: "Medium (0.3-0.6)", value: filtered.filter((p) => getRiskLevel(p.churnRiskScore) === "medium").length, color: PALETTE.warning },
      { name: "High (>0.6)", value: filtered.filter((p) => getRiskLevel(p.churnRiskScore) === "high").length, color: PALETTE.danger },
    ];

    const aiActionDist = [
      { name: "Reactive", value: reactive, color: PALETTE.danger },
      { name: "Proactive", value: proactive, color: PALETTE.warning },
      { name: "Monitor", value: total - reactive - proactive, color: PALETTE.accent },
    ];

    // Engagement vs churn risk scatter
    const scatterData = filtered.map((p) => ({
      x: parseFloat(fmt(p.engagementScore, 3)),
      y: parseFloat(fmt(p.churnRiskScore, 3)),
      type: p.customerType,
      id: p.customerId,
    }));

    // Recharge freq bucketed
    const rechargeBuckets: Record<number, { healthy: number; churn: number }> = {};
    filtered.forEach((p) => {
      const freq = p.rechargeFreq;
      if (!rechargeBuckets[freq]) rechargeBuckets[freq] = { healthy: 0, churn: 0 };
      p.churn ? rechargeBuckets[freq].churn++ : rechargeBuckets[freq].healthy++;
    });
    const rechargeData = Object.entries(rechargeBuckets)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([freq, counts]) => ({ freq: `F${freq}`, ...counts }));

    // Network quality vs data usage bucketed
    const networkBuckets = [
      { range: "0-0.25", label: "Poor", min: 0, max: 0.25 },
      { range: "0.25-0.5", label: "Fair", min: 0.25, max: 0.5 },
      { range: "0.5-0.75", label: "Good", min: 0.5, max: 0.75 },
      { range: "0.75-1", label: "Excellent", min: 0.75, max: 1 },
    ].map((b) => {
      const bucket = filtered.filter((p) => p.networkQuality >= b.min && p.networkQuality < b.max);
      return {
        label: b.label,
        avgUsage: bucket.length ? bucket.reduce((s, p) => s + p.avgDataUsage, 0) / bucket.length : 0,
        count: bucket.length,
        avgRisk: bucket.length ? bucket.reduce((s, p) => s + p.churnRiskScore, 0) / bucket.length : 0,
      };
    });

    // Radar for avg metrics
    const radarData = [
      { metric: "Engagement", value: avgEngagement * 100 },
      { metric: "Network", value: avgNetwork * 100 },
      { metric: "Recharge", value: (total ? filtered.reduce((s, p) => s + p.rechargeFreq, 0) / total : 0) * 10 },
      { metric: "Data Usage", value: Math.min((avgDataUsage / 20) * 100, 100) },
      { metric: "Risk (inv)", value: (1 - avgRisk) * 100 },
    ];

    const complaintTypes = filtered
      .filter((p) => p.complaintText && p.complaintText !== "None")
      .reduce<Record<string, number>>((acc, p) => {
        acc[p.complaintText] = (acc[p.complaintText] || 0) + 1;
        return acc;
      }, {});

    const complaintData = Object.entries(complaintTypes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    return {
      total,
      churned,
      churnRate: total ? churned / total : 0,
      withComplaints,
      reactive,
      proactive,
      avgRisk,
      avgEngagement,
      avgNetwork,
      avgDataUsage,
      segmentDist,
      riskDist,
      aiActionDist,
      scatterData,
      rechargeData,
      networkBuckets,
      radarData,
      complaintData,
    };
  }, [filtered]);

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : "—";

  const TOOLTIP_STYLE = {
    backgroundColor: PALETTE.surfaceAlt,
    border: `1px solid ${PALETTE.border}`,
    borderRadius: 8,
    color: PALETTE.text,
    fontSize: 12,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: PALETTE.bg,
        color: PALETTE.text,
        fontFamily: "'DM Sans', 'Outfit', sans-serif",
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 50% -20%, #00213A55 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 90% 10%, #00D4FF0A 0%, transparent 50%)
        `,
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          borderBottom: `1px solid ${PALETTE.border}`,
          px: { xs: 3, md: 5 },
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          bgcolor: `${PALETTE.bg}CC`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${PALETTE.accent}, ${PALETTE.purple})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SignalCellularAltIcon sx={{ color: "#fff", fontSize: "1.1rem" }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: PALETTE.text, lineHeight: 1 }}>
                Customer Insight Analysis
              </Typography>
              <Typography sx={{ color: PALETTE.textMuted, fontSize: "0.65rem", letterSpacing: "0.12em" }}>
                INTELLIGENCE DASHBOARD
              </Typography>
            </Box>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FiberSmartRecordIcon
              sx={{
                color: PALETTE.success,
                fontSize: "0.7rem",
                animation: "blink 2s ease-in-out infinite",
                "@keyframes blink": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.3 },
                },
              }}
            />
            <Typography sx={{ color: PALETTE.textMuted, fontSize: "0.75rem" }}>
              Live · Updated {lastUpdated}
            </Typography>
            {isFetching && <CircularProgress size={12} sx={{ color: PALETTE.accent }} />}
          </Stack>
          <Tooltip title="Refresh now">
            <IconButton
              onClick={() => refetch()}
              size="small"
              sx={{
                border: `1px solid ${PALETTE.border}`,
                borderRadius: "8px",
                color: PALETTE.textMuted,
                "&:hover": { color: PALETTE.accent, borderColor: PALETTE.accent },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* ── Main Content ── */}
      <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>
        {/* ── Filters ── */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: PALETTE.textMuted }}>Segment</InputLabel>
            <Select
              value={segment}
              label="Segment"
              onChange={(e) => setSegment(e.target.value)}
              sx={{
                color: PALETTE.text,
                bgcolor: PALETTE.surface,
                borderRadius: "10px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: PALETTE.border },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: PALETTE.accent },
                "& .MuiSvgIcon-root": { color: PALETTE.textMuted },
              }}
            >
              {["All Customers", "Healthy", "Silent Churn", "Vocal Churn"].map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel sx={{ color: PALETTE.textMuted }}>Risk Threshold</InputLabel>
            <Select
              value={riskFilter}
              label="Risk Threshold"
              onChange={(e) => setRiskFilter(e.target.value)}
              sx={{
                color: PALETTE.text,
                bgcolor: PALETTE.surface,
                borderRadius: "10px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: PALETTE.border },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: PALETTE.accent },
                "& .MuiSvgIcon-root": { color: PALETTE.textMuted },
              }}
            >
              {["All risk levels", "Low (< 0.3)", "Medium (0.3 - 0.6)", "High (> 0.6)"].map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            {["Healthy", "Silent Churn", "Vocal Churn"].map((seg) => (
              <Chip
                key={seg}
                label={`${seg}: ${analytics.segmentDist.find((s) => s.name === seg)?.value ?? 0}`}
                size="small"
                sx={{
                  bgcolor: `${SEGMENT_COLORS[seg]}18`,
                  color: SEGMENT_COLORS[seg],
                  border: `1px solid ${SEGMENT_COLORS[seg]}44`,
                  fontWeight: 600,
                  fontSize: "0.72rem",
                }}
              />
            ))}
          </Box>
        </Stack>

        {/* ── Loading / Error ── */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: PALETTE.accent }} />
          </Box>
        )}
        {isError && (
          <Alert severity="error" sx={{ mb: 3, bgcolor: "#ff4d6a22", color: PALETTE.danger, borderColor: PALETTE.danger }}>
            Failed to load prediction data. Retrying automatically...
          </Alert>
        )}

        {!isLoading && (
          <Fade in timeout={600}>
            <Box>
              {/* ── KPI Cards ── */}
              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard icon={<PeopleIcon />} label="Total Customers" value={analytics.total} sub={`${data?.totalCount ?? 0} total in DB`} color={PALETTE.accent} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard icon={<TrendingDownIcon />} label="Churn Rate" value={pct(analytics.churnRate)} sub={`${analytics.churned} churned`} color={PALETTE.danger} pulse={analytics.churnRate > 0.4} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard icon={<FlashOnIcon />} label="AI Interventions" value={analytics.reactive + analytics.proactive} sub={`${analytics.reactive} reactive · ${analytics.proactive} proactive`} color={PALETTE.warning} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard icon={<NetworkCheckIcon />} label="Avg Risk Score" value={fmt(analytics.avgRisk, 3)} sub={`Network: ${pct(analytics.avgNetwork)}`} color={analytics.avgRisk > 0.6 ? PALETTE.danger : analytics.avgRisk > 0.3 ? PALETTE.warning : PALETTE.success} />
                </Grid>
              </Grid>

              {/* ── Second KPI row ── */}
              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard icon={<RecordVoiceOverIcon />} label="With Complaints" value={analytics.withComplaints} sub={`${pct(analytics.withComplaints / (analytics.total || 1))} of segment`} color={PALETTE.purple} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard icon={<SupportAgentIcon />} label="Reactive Actions" value={analytics.reactive} sub="High risk + complaint" color={PALETTE.danger} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard icon={<WarningAmberIcon />} label="Proactive Actions" value={analytics.proactive} sub="High risk, no complaint" color={PALETTE.warning} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard icon={<SignalCellularAltIcon />} label="Avg Engagement" value={pct(analytics.avgEngagement)} sub={`Avg data: ${fmt(analytics.avgDataUsage)} GB`} color={PALETTE.accentSoft} />
                </Grid>
              </Grid>

              {/* ── Charts Row 1 ── */}
              <SectionTitle>Segment & Risk Distribution</SectionTitle>
              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                {/* Segment Pie */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <ChartCard title="Customer Segment Distribution" height={260}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={analytics.segmentDist} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value">
                          {analytics.segmentDist.map((entry, i) => (
                            <Cell key={i} fill={entry.color} stroke="transparent" />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                        <Legend
                          formatter={(value) => <span style={{ color: PALETTE.textMuted, fontSize: 12 }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </Grid>

                {/* Risk Distribution */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <ChartCard title="Risk Level Distribution" height={260}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.riskDist} barSize={36}>
                        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
                        <XAxis dataKey="name" tick={{ fill: PALETTE.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: PALETTE.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {analytics.riskDist.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </Grid>

                {/* AI Action Pie */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <ChartCard title="AI Intervention Actions" height={260}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={analytics.aiActionDist} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value">
                          {analytics.aiActionDist.map((entry, i) => (
                            <Cell key={i} fill={entry.color} stroke="transparent" />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                        <Legend formatter={(v) => <span style={{ color: PALETTE.textMuted, fontSize: 12 }}>{v}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </Grid>
              </Grid>

              {/* ── Charts Row 2 ── */}
              <SectionTitle>Behavioral & Network Analytics</SectionTitle>
              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                {/* Recharge Frequency */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <ChartCard title="Churn vs Healthy by Recharge Frequency" height={260}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.rechargeData} barSize={14} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
                        <XAxis dataKey="freq" tick={{ fill: PALETTE.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: PALETTE.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                        <Legend formatter={(v) => <span style={{ color: PALETTE.textMuted, fontSize: 12 }}>{v}</span>} />
                        <Bar dataKey="healthy" name="Healthy" fill={PALETTE.success} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="churn" name="Churned" fill={PALETTE.danger} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </Grid>

                {/* Network Quality Impact */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <ChartCard title="Network Quality → Avg Data Usage & Risk" height={260}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.networkBuckets} barSize={20} barGap={6}>
                        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
                        <XAxis dataKey="label" tick={{ fill: PALETTE.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="usage" tick={{ fill: PALETTE.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="risk" orientation="right" tick={{ fill: PALETTE.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 1]} />
                        <RechartsTooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number, name: string) => [fmt(v, 3), name]} />
                        <Legend formatter={(v) => <span style={{ color: PALETTE.textMuted, fontSize: 12 }}>{v}</span>} />
                        <Bar yAxisId="usage" dataKey="avgUsage" name="Avg Data (GB)" fill={PALETTE.accent} radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="risk" dataKey="avgRisk" name="Avg Risk Score" fill={PALETTE.danger} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </Grid>
              </Grid>

              {/* ── Charts Row 3 ── */}
              <SectionTitle>Deep Insights</SectionTitle>
              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                {/* Engagement vs Risk Scatter */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <ChartCard title="Engagement Score vs Churn Risk" height={280}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
                        <XAxis dataKey="x" name="Engagement" type="number" domain={[0, 1]} tick={{ fill: PALETTE.textMuted, fontSize: 10 }} axisLine={false} label={{ value: "Engagement", position: "insideBottom", offset: -2, fill: PALETTE.textMuted, fontSize: 10 }} />
                        <YAxis dataKey="y" name="Churn Risk" type="number" domain={[0, 1]} tick={{ fill: PALETTE.textMuted, fontSize: 10 }} axisLine={false} label={{ value: "Risk", angle: -90, position: "insideLeft", fill: PALETTE.textMuted, fontSize: 10 }} />
                        <RechartsTooltip contentStyle={TOOLTIP_STYLE} cursor={{ strokeDasharray: "3 3", stroke: PALETTE.border }} />
                        {["Healthy", "Silent Churn", "Vocal Churn"].map((type) => (
                          <Scatter
                            key={type}
                            name={type}
                            data={analytics.scatterData.filter((d) => d.type === type)}
                            fill={SEGMENT_COLORS[type]}
                            opacity={0.8}
                          />
                        ))}
                        <Legend formatter={(v) => <span style={{ color: PALETTE.textMuted, fontSize: 11 }}>{v}</span>} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </Grid>

                {/* Radar chart */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <ChartCard title="Avg Customer Health Radar" height={280}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={analytics.radarData}>
                        <PolarGrid stroke={PALETTE.border} />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: PALETTE.textMuted, fontSize: 10 }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={{ fill: PALETTE.textMuted, fontSize: 9 }} />
                        <Radar name="Score" dataKey="value" stroke={PALETTE.accent} fill={PALETTE.accent} fillOpacity={0.2} dot={{ fill: PALETTE.accent, r: 3 }} />
                        <RechartsTooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${fmt(v)}%`]} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </Grid>

                {/* Complaint breakdown */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <ChartCard title="Top Complaint Types" height={280}>
                    {analytics.complaintData.length === 0 ? (
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Typography sx={{ color: PALETTE.textMuted, fontSize: "0.8rem" }}>No complaints in this segment</Typography>
                      </Box>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.complaintData} layout="vertical" barSize={14}>
                          <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} horizontal={false} />
                          <XAxis type="number" tick={{ fill: PALETTE.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="name" tick={{ fill: PALETTE.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
                          <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                          <Bar dataKey="value" fill={PALETTE.purple} radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </ChartCard>
                </Grid>
              </Grid>

              {/* ── Risk Score Progress Bars ── */}
              <SectionTitle>Risk Breakdown by Segment</SectionTitle>
              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                {["Healthy", "Silent Churn", "Vocal Churn"].map((seg) => {
                  const segData = filtered.filter((p) => p.customerType === seg);
                  const avgRisk = segData.length ? segData.reduce((s, p) => s + p.churnRiskScore, 0) / segData.length : 0;
                  const avgEng = segData.length ? segData.reduce((s, p) => s + p.engagementScore, 0) / segData.length : 0;
                  const avgNet = segData.length ? segData.reduce((s, p) => s + p.networkQuality, 0) / segData.length : 0;
                  const color = SEGMENT_COLORS[seg];
                  return (
                    <Grid size={{ xs: 12, md: 4 }} key={seg}>
                      <Card sx={{ background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderLeft: `3px solid ${color}`, borderRadius: "16px", p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
                          <Typography sx={{ fontWeight: 700, color: PALETTE.text }}>{seg}</Typography>
                          <Chip label={segData.length} size="small" sx={{ bgcolor: `${color}18`, color, fontSize: "0.7rem", height: 20 }} />
                        </Stack>
                        {[
                          { label: "Avg Churn Risk", value: avgRisk, color: avgRisk > 0.6 ? PALETTE.danger : avgRisk > 0.3 ? PALETTE.warning : PALETTE.success },
                          { label: "Avg Engagement", value: avgEng, color: PALETTE.accent },
                          { label: "Avg Network Quality", value: avgNet, color: PALETTE.purple },
                        ].map((m) => (
                          <Box key={m.label} sx={{ mb: 1.5 }}>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                              <Typography sx={{ color: PALETTE.textMuted, fontSize: "0.72rem" }}>{m.label}</Typography>
                              <Typography sx={{ color: m.color, fontSize: "0.72rem", fontWeight: 700 }}>{pct(m.value)}</Typography>
                            </Stack>
                            <LinearProgress variant="determinate" value={m.value * 100} sx={{ height: 5, borderRadius: 4, bgcolor: `${m.color}18`, "& .MuiLinearProgress-bar": { bgcolor: m.color, borderRadius: 4 } }} />
                          </Box>
                        ))}
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {/* ── Customer Table ── */}
              <SectionTitle>Customer Intelligence Table</SectionTitle>
              <Card sx={{ background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: "16px", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 420 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        {["Customer ID", "Segment", "Churn Risk", "Engagement", "Network", "Recharge Freq", "Complaint", "AI Action"].map((h) => (
                          <TableCell key={h} sx={{ bgcolor: PALETTE.surfaceAlt, color: PALETTE.textMuted, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: `1px solid ${PALETTE.border}` }}>
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filtered.slice(0, 20).map((p) => {
                        const action = getAIAction(p);
                        const riskLvl = getRiskLevel(p.churnRiskScore);
                        const actionColor = action === "Reactive" ? PALETTE.danger : action === "Proactive" ? PALETTE.warning : PALETTE.accent;
                        return (
                          <TableRow
                            key={p.id}
                            sx={{
                              "&:hover": { bgcolor: `${PALETTE.accent}08` },
                              "& td": { borderBottom: `1px solid ${PALETTE.border}40` },
                            }}
                          >
                            <TableCell sx={{ color: PALETTE.text, fontSize: "0.8rem", fontWeight: 600 }}>#{p.customerId}</TableCell>
                            <TableCell>
                              <Chip label={p.customerType} size="small" sx={{ bgcolor: `${SEGMENT_COLORS[p.customerType]}15`, color: SEGMENT_COLORS[p.customerType], fontSize: "0.68rem", height: 20, fontWeight: 600 }} />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: `${RISK_COLORS[riskLvl]}22`, overflow: "hidden" }}>
                                  <Box sx={{ width: `${p.churnRiskScore * 100}%`, height: "100%", bgcolor: RISK_COLORS[riskLvl] }} />
                                </Box>
                                <Typography sx={{ color: RISK_COLORS[riskLvl], fontSize: "0.75rem", fontWeight: 700 }}>
                                  {fmt(p.churnRiskScore, 3)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: PALETTE.textMuted, fontSize: "0.75rem" }}>{pct(p.engagementScore)}</TableCell>
                            <TableCell sx={{ color: PALETTE.textMuted, fontSize: "0.75rem" }}>{pct(p.networkQuality)}</TableCell>
                            <TableCell sx={{ color: PALETTE.textMuted, fontSize: "0.75rem" }}>{p.rechargeFreq}x</TableCell>
                            <TableCell sx={{ color: PALETTE.textMuted, fontSize: "0.72rem", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {p.complaintText === "None" ? <span style={{ color: PALETTE.border }}>—</span> : p.complaintText}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={action}
                                size="small"
                                sx={{
                                  bgcolor: `${actionColor}18`,
                                  color: actionColor,
                                  fontSize: "0.68rem",
                                  height: 20,
                                  fontWeight: 700,
                                  border: `1px solid ${actionColor}33`,
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                {filtered.length > 20 && (
                  <Box sx={{ px: 3, py: 1.5, borderTop: `1px solid ${PALETTE.border}` }}>
                    <Typography sx={{ color: PALETTE.textMuted, fontSize: "0.75rem" }}>
                      Showing 20 of {filtered.length} customers in current filter
                    </Typography>
                  </Box>
                )}
              </Card>

              {/* ── Footer ── */}
              <Box sx={{ mt: 5, pt: 3, borderTop: `1px solid ${PALETTE.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Typography sx={{ color: PALETTE.textMuted, fontSize: "0.72rem" }}>
                  Customer Insight Analysis Dashboard · Auto-refreshes every 30s · Page {data?.page ?? "—"} of {data?.totalPages ?? "—"}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {[PALETTE.danger, PALETTE.warning, PALETTE.success].map((c, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: c }} />
                      <Typography sx={{ color: PALETTE.textMuted, fontSize: "0.68rem" }}>
                        {["High", "Medium", "Low"][i]} Risk
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}












// "use client";

// import React, { useState, useMemo } from "react";
// import { 
//   Box, Grid, Card, Typography, Stack, MenuItem, Select, 
//   FormControl, InputLabel, Chip, LinearProgress 
// } from "@mui/material";
// import { PieChart, BarChart, LineChart } from "@mui/x-charts";
// import { useDashboardData } from "@/lib/react-query/insight-analysis.queries";
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// export default function AnalyticsDashboard() {
//   const [page] = useState(1);
//   const [pageSize] = useState(80); // Fetching a larger set for better analytics
//   const [segmentFilter, setSegmentFilter] = useState("All");
//   const [riskFilter, setRiskFilter] = useState("All");

//   const { data, isLoading } = useDashboardData(page, pageSize);

//   // Data Transformation & Filtering
//   const processedData = useMemo(() => {
//     if (!data?.predictions) return [];

//     return data.predictions.map((item: any) => {
//       // Calculate Intervention Type
//       let intervention = "Stable";
//       if (item.churnRiskScore > 0.7) {
//         intervention = item.hasComplaint === 1 ? "Reactive" : "Proactive";
//       }

//       return { ...item, intervention };
//     }).filter((item: any) => {
//       const matchesSegment = segmentFilter === "All" || item.customerType === segmentFilter;
//       const matchesRisk = 
//         riskFilter === "All" ||
//         (riskFilter === "Low" && item.churnRiskScore < 0.3) ||
//         (riskFilter === "Medium" && item.churnRiskScore >= 0.3 && item.churnRiskScore <= 0.6) ||
//         (riskFilter === "High" && item.churnRiskScore > 0.6);
      
//       return matchesSegment && matchesRisk;
//     });
//   }, [data, segmentFilter, riskFilter]);

//   // Aggregations for Charts
//   const interventionStats = [
//     { id: 0, value: processedData.filter(d => d.intervention === "Proactive").length, label: "Proactive" },
//     { id: 1, value: processedData.filter(d => d.intervention === "Reactive").length, label: "Reactive" },
//     { id: 2, value: processedData.filter(d => d.intervention === "Stable").length, label: "Stable" },
//   ];

//   if (isLoading) return <LinearProgress />;

//   return (
//     <Box sx={{ p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
//       <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
//         <Box>
//           <Typography variant="h4" fontWeight={700} color="primary">Customer Insights</Typography>
//           <Typography color="textSecondary">Real-time churn risk & AI intervention tracking</Typography>
//         </Box>

//         <Stack direction="row" spacing={2}>
//           <FormControl size="small" sx={{ minWidth: 150 }}>
//             <InputLabel>Segment</InputLabel>
//             <Select value={segmentFilter} label="Segment" onChange={(e) => setSegmentFilter(e.target.value)}>
//               <MenuItem value="All">All Customers</MenuItem>
//               <MenuItem value="Healthy">Healthy</MenuItem>
//               <MenuItem value="Silent Churn">Silent Churn</MenuItem>
//               <MenuItem value="Vocal Churn">Vocal Churn</MenuItem>
//             </Select>
//           </FormControl>

//           <FormControl size="small" sx={{ minWidth: 150 }}>
//             <InputLabel>Risk Threshold</InputLabel>
//             <Select value={riskFilter} label="Risk Threshold" onChange={(e) => setRiskFilter(e.target.value)}>
//               <MenuItem value="All">All Levels</MenuItem>
//               <MenuItem value="Low">Low (&lt; 0.3)</MenuItem>
//               <MenuItem value="Medium">Medium (0.3-0.6)</MenuItem>
//               <MenuItem value="High">High (&gt; 0.6)</MenuItem>
//             </Select>
//           </FormControl>
//         </Stack>
//       </Stack>

//       <Grid container spacing={3}>
//         {/* KPI Cards */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
//             <Typography variant="overline" color="textSecondary">High Risk Customers</Typography>
//             <Typography variant="h3" fontWeight={700} color="error.main">
//               {processedData.filter(d => d.churnRiskScore > 0.6).length}
//             </Typography>
//             <Chip icon={<WarningAmberIcon />} label="Requires Attention" color="error" size="small" sx={{ mt: 1 }} />
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
//             <Typography variant="overline" color="textSecondary">Avg. Engagement</Typography>
//             <Typography variant="h3" fontWeight={700} color="primary.main">
//               {(processedData.reduce((acc, curr) => acc + curr.engagementScore, 0) / processedData.length).toFixed(2)}
//             </Typography>
//             <Chip icon={<TrendingUpIcon />} label="System Average" color="primary" size="small" sx={{ mt: 1 }} />
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
//             <Typography variant="overline" color="textSecondary">Reactive Actions</Typography>
//             <Typography variant="h3" fontWeight={700}>
//               {processedData.filter(d => d.intervention === "Reactive").length}
//             </Typography>
//             <Typography variant="body2" color="textSecondary" mt={1}>Customers with complaints & high risk</Typography>
//           </Card>
//         </Grid>

//         {/* Charts Section */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ p: 3, borderRadius: 4, height: 400 }}>
//             <Typography variant="h6" mb={2}>AI Intervention Breakdown</Typography>
//             <PieChart
//               series={[{ data: interventionStats, innerRadius: 80, paddingAngle: 5, cornerRadius: 5 }]}
//               width={400}
//               height={300}
//             />
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Card sx={{ p: 3, borderRadius: 4, height: 400 }}>
//             <Typography variant="h6" mb={2}>Churn Risk vs. Usage Change</Typography>
//             <BarChart
//               dataset={processedData.slice(0, 10)}
//               xAxis={[{ scaleType: 'band', dataKey: 'customerId', label: 'Customer ID' }]}
//               series={[
//                 { dataKey: 'churnRiskScore', label: 'Risk Score', color: '#8884d8' },
//                 { dataKey: 'usageChangePct', label: 'Usage Change %', color: '#82ca9d' }
//               ]}
//               height={300}
//             />
//           </Card>
//         </Grid>

//         {/* Insight Section */}
//         <Grid item xs={12}>
//           <Card sx={{ p: 3, borderRadius: 4, bgcolor: "primary.main", color: "white" }}>
//             <Typography variant="h6" gutterBottom>Automated Insights</Typography>
//             <Typography variant="body1">
//               {processedData.filter(d => d.intervention === "Proactive").length > 0 
//                 ? `System Alert: You have ${processedData.filter(d => d.intervention === "Proactive").length} customers in the "Proactive" category. These users are at high risk of churning despite not filing complaints. Immediate outreach is recommended.`
//                 : "System Analysis: No immediate proactive interventions required for current filtered segment."}
//             </Typography>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }
