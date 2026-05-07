"use client";

import React, { useMemo, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import RefreshIcon from "@mui/icons-material/Refresh";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
	Alert,
	Avatar,
	Box,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Fade,
	Grid,
	IconButton,
	LinearProgress,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
	Typography,
} from "@mui/material";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	RadialBar,
	RadialBarChart,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

import { M } from "@/config/mtn-tokens";
import { useAnalyticsDashboard } from "@/lib/react-query/analytics.queries";

// import { useAnalyticsDashboard } from "@/queries/analytics.queries";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
// Warm, editorial, amber-on-charcoal — completely distinct from ChurnIQ
// const T = {
// 	bg: "#fff",
// 	surface: "#cde3c14c",
// 	surfaceAlt: "#fff",
// 	surfaceHover: "",
// 	border: "#1A2E50",
// 	borderLight: "#254275",
// 	gold: "#091326",
// 	goldSoft: "#050A14",
// 	goldDim: "#F5C84222",
// 	teal: "#2DD4BF",
// 	tealDim: "#2DD4BF18",
// 	rose: "#FB7185",
// 	roseDim: "#FB718518",
// 	sky: "#38BDF8",
// 	skyDim: "#38BDF818",
// 	amber: "#FB923C",
// 	amberDim: "#FB923C18",
// 	green: "#4ADE80",
// 	greenDim: "#4ADE8018",
// 	text: "#050A14",
// 	textMuted: "#8C8660",
// 	textFaint: "#4A4728",
// };

const DAY_OPTIONS = [7, 14, 30, 60, 90];

const SENTIMENT_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
	angry: { color: M.rose, icon: <SentimentVeryDissatisfiedIcon />, label: "Angry" },
	frustrated: { color: M.amber, icon: <SentimentDissatisfiedIcon />, label: "Frustrated" },
	neutral: { color: M.sky, icon: <SentimentNeutralIcon />, label: "Neutral" },
	positive: { color: M.green, icon: <SentimentSatisfiedAltIcon />, label: "Positive" },
};

const CATEGORY_COLORS: Record<string, string> = {
	billing: M.rose,
	data: M.sky,
	network: M.teal,
	other: M.textMuted,
	sim: M.amber,
	call: M.green,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number, d = 1) => n.toFixed(d);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const TOOLTIP_STYLE = {
	backgroundColor: M.surfaceAlt,
	border: `1px solid ${M.border}`,
	borderRadius: 8,
	color: M.text,
	fontSize: 12,
	fontFamily: "inherit",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
			<Box
				sx={{
					width: 18,
					height: 2,
					bgcolor: M.surface,
					borderRadius: 2,
				}}
			/>
			<Typography
				sx={{
					color: M.textMuted,
					fontSize: "0.68rem",
					fontWeight: 700,
					letterSpacing: "0.14em",
					textTransform: "uppercase",
				}}
			>
				{children}
			</Typography>
			<Box sx={{ flex: 1, height: "1px", bgcolor: M.border }} />
		</Box>
	);
}

function KpiCard({
	icon,
	label,
	value,
	sub,
	accent,
	// trend,
}: {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	sub?: string;
	accent: string;
	trend?: "up" | "down" | "neutral";
}) {
	return (
		<Card
			sx={{
				bgcolor: M.surface,
				border: `1px solid ${M.border}`,
				borderRadius: "14px",
				position: "relative",
				overflow: "hidden",
				cursor: "default",
				transition: "all 0.25s ease",
				"&:hover": {
					bgcolor: M.surfaceWarm,
					borderColor: `${accent}55`,
					transform: "translateY(-3px)",
					boxShadow: `0 16px 48px ${accent}14`,
				},
			}}
		>
			{/* corner accent line */}
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "2px",
					background: `linear-gradient(90deg, ${accent} 0%, transparent 70%)`,
				}}
			/>
			{/* ambient glow */}
			<Box
				sx={{
					position: "absolute",
					top: -30,
					right: -30,
					width: 120,
					height: 120,
					borderRadius: "50%",
					background: `radial-gradient(circle, ${accent}0F 0%, transparent 70%)`,
					pointerEvents: "none",
				}}
			/>
			<CardContent sx={{ p: "20px 24px" }}>
				<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
					<Box sx={{ flex: 1 }}>
						<Typography
							sx={{
								color: M.textMuted,
								fontSize: "0.67rem",
								fontWeight: 700,
								letterSpacing: "0.1em",
								textTransform: "uppercase",
								mb: 1,
							}}
						>
							{label}
						</Typography>
						<Typography
							sx={{
								color: M.text,
								fontSize: "2.1rem",
								fontWeight: 800,
								lineHeight: 1,
								fontVariantNumeric: "tabular-nums",
								letterSpacing: "-0.02em",
							}}
						>
							{value}
						</Typography>
						{sub && <Typography sx={{ color: M.textMuted, fontSize: "0.72rem", mt: 0.75 }}>{sub}</Typography>}
					</Box>
					<Avatar
						sx={{
							width: 44,
							height: 44,
							bgcolor: `${accent}15`,
							border: `1px solid ${accent}30`,
							"& svg": { color: accent, fontSize: "1.25rem" },
						}}
					>
						{icon}
					</Avatar>
				</Stack>
			</CardContent>
		</Card>
	);
}

function ChartShell({
	title,
	height = 260,
	children,
	accent,
}: {
	title: string;
	height?: number;
	children: React.ReactNode;
	accent?: string;
}) {
	return (
		<Card
			sx={{
				bgcolor: M.surface,
				border: `1px solid ${M.border}`,
				borderRadius: "14px",
				p: "24px 24px 16px",
				height: "100%",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
				{accent && <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: accent, flexShrink: 0 }} />}
				<Typography
					sx={{
						color: M.textMuted,
						fontSize: "0.68rem",
						fontWeight: 700,
						letterSpacing: "0.12em",
						textTransform: "uppercase",
					}}
				>
					{title}
				</Typography>
			</Box>
			<Box sx={{ height }}>{children}</Box>
		</Card>
	);
}

// ─── Star Rating visual ────────────────────────────────────────────────────────
function StarRating({ value, max = 5 }: { value: number; max?: number }) {
	return (
		<Stack direction="row" spacing={0.4} alignItems="center">
			{Array.from({ length: max }).map((_, i) => {
				const filled = i < Math.floor(value);
				const partial = !filled && i < value;
				return (
					<Box
						key={i}
						sx={{
							width: 10,
							height: 10,
							borderRadius: "2px",
							bgcolor: filled ? M.black : partial ? M.black : M.border,
							opacity: filled ? 1 : partial ? 0.6 : 0.3,
						}}
					/>
				);
			})}
			<Typography sx={{ color: M.black, fontSize: "0.78rem", fontWeight: 700, ml: 0.5 }}>{fmt(value)}</Typography>
		</Stack>
	);
}

// ─── Custom Tooltip for Area Chart ───────────────────────────────────────────
const DailyTooltip = ({ active, payload, label }: any) => {
	if (!active || !payload?.length) return null;
	return (
		<Box
			sx={{
				bgcolor: M.surfaceAlt,
				border: `1px solid ${M.borderLight}`,
				borderRadius: "8px",
				px: 2,
				py: 1.5,
			}}
		>
			<Typography sx={{ color: M.textMuted, fontSize: "0.68rem", mb: 0.5 }}>{label}</Typography>
			<Typography sx={{ color: M.gold, fontSize: "1rem", fontWeight: 700 }}>{payload[0].value} calls</Typography>
		</Box>
	);
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function CallAnalyticsDashboard() {
	const [days, setDays] = useState(30);

	const { data: response, isLoading, isError, refetch, isFetching } = useAnalyticsDashboard(days);

	const d = response?.data;

	// ── Derived data ──
	const dailyVolumeData = useMemo(() => {
		if (!d?.dailyCallVolume) return [];
		return Object.entries(d.dailyCallVolume).map(([date, count]) => ({
			date: date.slice(5), // "MM-DD"
			calls: count as number,
		}));
	}, [d]);

	const sentimentData = useMemo(() => {
		if (!d?.callsBySentiment) return [];
		return Object.entries(d.callsBySentiment).map(([key, val]) => ({
			name: SENTIMENT_CONFIG[key]?.label ?? cap(key),
			value: val as number,
			pct: d.sentimentPercentages?.[key] ?? 0,
			color: SENTIMENT_CONFIG[key]?.color ?? M.textMuted,
		}));
	}, [d]);

	const categoryData = useMemo(() => {
		if (!d?.callsByCategory) return [];
		return Object.entries(d.callsByCategory)
			.map(([key, val]) => ({
				name: cap(key),
				value: val as number,
				pct: d.categoryPercentages?.[key] ?? 0,
				color: CATEGORY_COLORS[key] ?? M.textMuted,
				unresolved: (d.unresolvedByCategory?.[key] as number) ?? 0,
			}))
			.sort((a, b) => b.value - a.value);
	}, [d]);

	const resolutionRadial = useMemo(() => {
		if (!d) return [];
		return [
			{ name: "Resolved", value: d.resolutionRate, fill: M.yellowDark },
			{ name: "Pending", value: 100 - d.resolutionRate, fill: M.border },
		];
	}, [d]);

	const peakDay = useMemo(() => {
		if (!dailyVolumeData.length) return null;
		return dailyVolumeData.reduce((a, b) => (a.calls > b.calls ? a : b));
	}, [dailyVolumeData]);

	const totalSentimentCount = sentimentData.reduce((s, x) => s + x.value, 0);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: M.bg,
				color: M.text,
				fontFamily: "'Sora', 'Nunito', 'DM Sans', sans-serif",
				backgroundImage: `
          radial-gradient(ellipse 70% 40% at 20% 0%, #F5C84208 0%, transparent 55%),
          radial-gradient(ellipse 50% 30% at 80% 100%, #2DD4BF06 0%, transparent 50%)
        `,
			}}
		>
			{/* ── Header ─────────────────────────────────────────────────────────── */}
			<Box
				sx={{
					borderBottom: `1px solid ${M.border}`,
					px: { xs: 3, md: 5 },
					py: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					position: "sticky",
					top: 0,
					zIndex: 100,
					bgcolor: `${M.bg}E0`,
					backdropFilter: "blur(16px)",
				}}
			>
				{/* Yellow left bar */}
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
							<HeadsetMicIcon sx={{ color: M.black, fontSize: "1.15rem" }} />
						</Box>
						<Box>
							<Typography
								sx={{ fontWeight: 800, fontSize: "1rem", color: M.black, lineHeight: 1, letterSpacing: "-0.01em" }}
							>
								CallPulse
							</Typography>
							<Typography sx={{ color: M.textMuted, fontSize: "0.6rem", letterSpacing: "0.12em" }}>
								CALL CENTER ANALYTICS
							</Typography>
						</Box>
					</Stack>
				</Stack>

				<Stack direction="row" alignItems="center" spacing={2}>
					{/* Day range toggle */}
					<ToggleButtonGroup
						value={days}
						exclusive
						onChange={(_, v) => v && setDays(v)}
						size="small"
						sx={{
							bgcolor: M.surface,
							border: `1px solid ${M.border}`,
							borderRadius: "10px",
							overflow: "hidden",
							"& .MuiToggleButton-root": {
								color: M.textMuted,
								border: "none",
								borderRadius: 0,
								px: 1.5,
								py: 0.5,
								fontSize: "0.72rem",
								fontWeight: 600,
								transition: "all 0.18s",
								"&.Mui-selected": {
									bgcolor: M.yellowLight,
									color: M.black,
									"&:hover": { bgcolor: M.black },
								},
								"&:hover": { bgcolor: M.surfaceWarm, color: M.text },
							},
						}}
					>
						{DAY_OPTIONS.map((d) => (
							<ToggleButton key={d} value={d}>
								{d}d
							</ToggleButton>
						))}
					</ToggleButtonGroup>

					<Stack direction="row" alignItems="center" spacing={1}>
						{isFetching && <CircularProgress size={12} sx={{ color: M.black }} />}
						<Typography sx={{ color: M.textFaint, fontSize: "0.72rem" }}>Last {days} days</Typography>
					</Stack>

					<Tooltip title="Refresh">
						<IconButton
							onClick={() => refetch()}
							size="small"
							sx={{
								border: `1px solid ${M.border}`,
								borderRadius: "8px",
								color: M.textMuted,
								"&:hover": { color: M.gold, borderColor: M.gold },
							}}
						>
							<RefreshIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Stack>
			</Box>

			{/* ── Body ───────────────────────────────────────────────────────────── */}
			<Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>
				{isLoading && (
					<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
						<Stack alignItems="center" spacing={2}>
							<CircularProgress sx={{ color: M.gold }} />
							<Typography sx={{ color: M.textMuted, fontSize: "0.8rem" }}>Loading analytics…</Typography>
						</Stack>
					</Box>
				)}

				{isError && (
					<Alert
						severity="error"
						sx={{ mb: 3, bgcolor: `${M.rose}15`, color: M.rose, border: `1px solid ${M.rose}33`, borderRadius: "10px" }}
					>
						Failed to load analytics data. Please try refreshing.
					</Alert>
				)}

				{!isLoading && d && (
					<Fade in timeout={500}>
						<Box>
							{/* ── KPI Row 1 ──────────────────────────────────────────────── */}
							<SectionLabel>Overview</SectionLabel>
							<Grid container spacing={2} sx={{ mb: 4 }}>
								<Grid size={{ xs: 12, sm: 6, md: 3 }}>
									<KpiCard
										icon={<PhoneInTalkIcon />}
										label="Total Calls"
										value={d.totalCalls}
										sub={`${d.activeCalls} active · ${d.endedCalls} ended`}
										accent={M.gold}
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6, md: 3 }}>
									<KpiCard
										icon={<PeopleAltIcon />}
										label="Unique Clients"
										value={d.totalUniqueClients}
										sub={`${fmt(d.totalCalls / Math.max(d.totalUniqueClients, 1), 1)} calls per client`}
										accent={M.teal}
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6, md: 3 }}>
									<KpiCard
										icon={<CheckCircleOutlineIcon />}
										label="Issues Resolved"
										value={d.issuesResolved}
										sub={`${d.issuesPending} still pending`}
										accent={M.green}
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6, md: 3 }}>
									<KpiCard
										icon={<TimerOutlinedIcon />}
										label="Avg Call Duration"
										value={`${fmt(d.averageCallDurationMinutes, 1)}m`}
										sub="per call average"
										accent={M.sky}
									/>
								</Grid>
							</Grid>

							{/* ── KPI Row 2 ──────────────────────────────────────────────── */}
							<Grid container spacing={2} sx={{ mb: 4 }}>
								<Grid size={{ xs: 12, sm: 6, md: 3 }}>
									<KpiCard
										icon={<TrendingUpIcon />}
										label="Resolution Rate"
										value={`${fmt(d.resolutionRate)}%`}
										sub="of total issues"
										accent={d.resolutionRate >= 50 ? M.yellowLight : M.yellowDim}
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6, md: 3 }}>
									<KpiCard
										icon={<StarHalfIcon />}
										label="Avg Satisfaction"
										value={fmt(d.averageSatisfactionRating)}
										sub="out of 5.0"
										accent={M.gold}
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6, md: 3 }}>
									<KpiCard
										icon={<PhoneInTalkIcon />}
										label="Active Right Now"
										value={d.activeCalls}
										sub={`${fmt((d.activeCalls / Math.max(d.totalCalls, 1)) * 100)}% of total`}
										accent={M.yellowDim}
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6, md: 3 }}>
									<KpiCard
										icon={<HourglassEmptyIcon />}
										label="Pending Issues"
										value={d.issuesPending}
										sub="awaiting resolution"
										accent={M.rose}
									/>
								</Grid>
							</Grid>

							{/* ── Daily Volume Chart ──────────────────────────────────────── */}
							<SectionLabel>Call Volume Trend</SectionLabel>
							<Grid container spacing={2} sx={{ mb: 4 }}>
								<Grid size={{ xs: 12 }}>
									<ChartShell title={`Daily Call Volume — Last ${days} Days`} height={220} accent={M.gold}>
										<ResponsiveContainer width="100%" height="100%">
											<AreaChart data={dailyVolumeData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
												<defs>
													<linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
														<stop offset="5%" stopColor={M.gold} stopOpacity={0.3} />
														<stop offset="95%" stopColor={M.gold} stopOpacity={0} />
													</linearGradient>
												</defs>
												<CartesianGrid strokeDasharray="3 3" stroke={M.border} vertical={false} />
												<XAxis
													dataKey="date"
													tick={{ fill: M.textMuted, fontSize: 10 }}
													axisLine={false}
													tickLine={false}
													interval={Math.floor(dailyVolumeData.length / 8)}
												/>
												<YAxis
													tick={{ fill: M.textMuted, fontSize: 10 }}
													axisLine={false}
													tickLine={false}
													allowDecimals={false}
												/>
												<RechartsTooltip content={<DailyTooltip />} />
												<Area
													type="monotone"
													dataKey="calls"
													stroke={M.gold}
													strokeWidth={2.5}
													fill="url(#goldGrad)"
													dot={false}
													activeDot={{ r: 5, fill: M.gold, stroke: M.bg, strokeWidth: 2 }}
												/>
											</AreaChart>
										</ResponsiveContainer>
									</ChartShell>
								</Grid>
							</Grid>

							{/* Peak day callout */}
							{peakDay && (
								<Box
									sx={{
										mb: 4,
										p: "14px 20px",
										bgcolor: M.goldDim,
										border: `1px solid ${M.gold}30`,
										borderRadius: "10px",
										display: "flex",
										alignItems: "center",
										gap: 2,
									}}
								>
									<TrendingUpIcon sx={{ color: M.gold, fontSize: "1.1rem" }} />
									<Typography sx={{ color: M.text, fontSize: "0.82rem" }}>
										<strong style={{ color: M.gold }}>Peak day:</strong> {peakDay.date} with{" "}
										<strong style={{ color: M.gold }}>{peakDay.calls} calls</strong> —{" "}
										{fmt((peakDay.calls / Math.max(d.totalCalls, 1)) * 100)}% of total volume
									</Typography>
								</Box>
							)}

							{/* ── Category & Sentiment ───────────────────────────────────── */}
							<SectionLabel>Category & Sentiment Breakdown</SectionLabel>
							<Grid container spacing={2} sx={{ mb: 4 }}>
								{/* Category bar chart */}
								<Grid size={{ xs: 12, md: 5 }}>
									<ChartShell title="Calls by Category" height={280} accent={M.yellowDim}>
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={categoryData} layout="vertical" barSize={16} margin={{ left: 10, right: 30 }}>
												<CartesianGrid strokeDasharray="3 3" stroke={M.border} horizontal={false} />
												<XAxis
													type="number"
													tick={{ fill: M.textMuted, fontSize: 10 }}
													axisLine={false}
													tickLine={false}
													allowDecimals={false}
												/>
												<YAxis
													type="category"
													dataKey="name"
													tick={{ fill: M.textMuted, fontSize: 11 }}
													axisLine={false}
													tickLine={false}
													width={60}
												/>
												<RechartsTooltip
													contentStyle={TOOLTIP_STYLE}
													formatter={(val: number, _: any, props: any) => [
														`${val} calls (${fmt(props.payload.pct)}%)`,
														props.payload.name,
													]}
												/>
												<Bar dataKey="value" radius={[0, 6, 6, 0]}>
													{categoryData.map((entry, i) => (
														<Cell key={i} fill={entry.color} />
													))}
												</Bar>
											</BarChart>
										</ResponsiveContainer>
									</ChartShell>
								</Grid>

								{/* Sentiment Pie */}
								<Grid size={{ xs: 12, md: 4 }}>
									<ChartShell title="Customer Sentiment" height={280} accent={M.amber}>
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={sentimentData}
													cx="50%"
													cy="48%"
													innerRadius={70}
													outerRadius={105}
													paddingAngle={3}
													dataKey="value"
												>
													{sentimentData.map((entry, i) => (
														<Cell key={i} fill={entry.color} stroke="transparent" />
													))}
												</Pie>
												<RechartsTooltip
													contentStyle={TOOLTIP_STYLE}
													formatter={(val: number, _: any, props: any) => [`${val} calls (${fmt(props.payload.pct)}%)`]}
												/>
												<Legend formatter={(v) => <span style={{ color: M.textMuted, fontSize: 11 }}>{v}</span>} />
											</PieChart>
										</ResponsiveContainer>
									</ChartShell>
								</Grid>

								{/* Sentiment detail cards */}
								<Grid size={{ xs: 12, md: 3 }}>
									<Card
										sx={{
											bgcolor: M.surface,
											border: `1px solid ${M.border}`,
											borderRadius: "14px",
											p: 2.5,
											height: "100%",
										}}
									>
										<Typography
											sx={{
												color: M.textMuted,
												fontSize: "0.68rem",
												fontWeight: 700,
												letterSpacing: "0.12em",
												textTransform: "uppercase",
												mb: 2,
											}}
										>
											Sentiment Detail
										</Typography>
										<Stack spacing={1.5}>
											{sentimentData.map((s) => (
												<Box key={s.name}>
													<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
														<Stack direction="row" alignItems="center" spacing={0.8}>
															<Box sx={{ color: s.color, "& svg": { fontSize: "1rem" } }}>
																{SENTIMENT_CONFIG[s.name.toLowerCase()]?.icon}
															</Box>
															<Typography sx={{ color: M.text, fontSize: "0.78rem", fontWeight: 600 }}>
																{s.name}
															</Typography>
														</Stack>
														<Typography sx={{ color: s.color, fontSize: "0.75rem", fontWeight: 700 }}>
															{s.value} ({fmt(s.pct)}%)
														</Typography>
													</Stack>
													<LinearProgress
														variant="determinate"
														value={(s.value / Math.max(totalSentimentCount, 1)) * 100}
														sx={{
															height: 4,
															borderRadius: 3,
															bgcolor: `${s.color}18`,
															"& .MuiLinearProgress-bar": { bgcolor: s.color, borderRadius: 3 },
														}}
													/>
												</Box>
											))}
										</Stack>
									</Card>
								</Grid>
							</Grid>

							{/* ── Resolution & Satisfaction ──────────────────────────────── */}
							<SectionLabel>Resolution & Quality</SectionLabel>
							<Grid container spacing={2} sx={{ mb: 4 }}>
								{/* Resolution Gauge */}
								<Grid size={{ xs: 12, md: 4 }}>
									<Card
										sx={{
											bgcolor: M.surface,
											border: `1px solid ${M.border}`,
											borderRadius: "14px",
											p: 3,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											minHeight: 280,
										}}
									>
										<Typography
											sx={{
												color: M.textMuted,
												fontSize: "0.68rem",
												fontWeight: 700,
												letterSpacing: "0.12em",
												textTransform: "uppercase",
												mb: 2,
												alignSelf: "flex-start",
											}}
										>
											Resolution Rate
										</Typography>
										<Box sx={{ position: "relative", width: 180, height: 180 }}>
											<ResponsiveContainer width="100%" height="100%">
												<RadialBarChart
													cx="50%"
													cy="50%"
													innerRadius="60%"
													outerRadius="90%"
													data={resolutionRadial}
													startAngle={90}
													endAngle={-270}
												>
													<RadialBar dataKey="value" cornerRadius={8} background={{ fill: M.border }} />
												</RadialBarChart>
											</ResponsiveContainer>
											<Box
												sx={{
													position: "absolute",
													inset: 0,
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Typography sx={{ color: M.green, fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}>
													{fmt(d.resolutionRate)}%
												</Typography>
												<Typography sx={{ color: M.textMuted, fontSize: "0.68rem" }}>resolved</Typography>
											</Box>
										</Box>
										<Stack direction="row" spacing={2.5} sx={{ mt: 2 }}>
											<Stack alignItems="center">
												<Typography sx={{ color: M.green, fontWeight: 700, fontSize: "1.1rem" }}>
													{d.issuesResolved}
												</Typography>
												<Typography sx={{ color: M.textMuted, fontSize: "0.68rem" }}>Resolved</Typography>
											</Stack>
											<Box sx={{ width: "1px", bgcolor: M.border }} />
											<Stack alignItems="center">
												<Typography sx={{ color: M.rose, fontWeight: 700, fontSize: "1.1rem" }}>
													{d.issuesPending}
												</Typography>
												<Typography sx={{ color: M.textMuted, fontSize: "0.68rem" }}>Pending</Typography>
											</Stack>
										</Stack>
									</Card>
								</Grid>

								{/* Satisfaction card */}
								<Grid size={{ xs: 12, md: 4 }}>
									<Card
										sx={{
											bgcolor: M.surface,
											border: `1px solid ${M.border}`,
											borderRadius: "14px",
											p: 3,
											minHeight: 280,
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
										}}
									>
										<Typography
											sx={{
												color: M.textMuted,
												fontSize: "0.68rem",
												fontWeight: 700,
												letterSpacing: "0.12em",
												textTransform: "uppercase",
												mb: 3,
											}}
										>
											Satisfaction Score
										</Typography>
										<Typography
											sx={{
												color: M.text,
												fontSize: "4rem",
												fontWeight: 900,
												lineHeight: 1,
												letterSpacing: "-0.04em",
												mb: 1,
											}}
										>
											{fmt(d.averageSatisfactionRating)}
											<Typography component="span" sx={{ color: M.textFaint, fontSize: "1.5rem", fontWeight: 400 }}>
												/5
											</Typography>
										</Typography>
										<StarRating value={d.averageSatisfactionRating} />
										<Box sx={{ mt: 3 }}>
											{[5, 4, 3, 2, 1].map((star) => {
												const width =
													star === Math.round(d.averageSatisfactionRating)
														? 70
														: star < Math.round(d.averageSatisfactionRating)
															? 40
															: 15;
												return (
													<Stack key={star} direction="row" alignItems="center" spacing={1} sx={{ mb: 0.7 }}>
														<Typography sx={{ color: M.textMuted, fontSize: "0.68rem", width: 12 }}>{star}</Typography>
														<Box
															sx={{
																height: 5,
																width: `${width}%`,
																bgcolor: star >= 4 ? M.gold : star === 3 ? M.amber : M.rose,
																borderRadius: 3,
																transition: "width 0.5s ease",
															}}
														/>
													</Stack>
												);
											})}
										</Box>
									</Card>
								</Grid>

								{/* Unresolved by Category */}
								<Grid size={{ xs: 12, md: 4 }}>
									<Card
										sx={{
											bgcolor: M.surface,
											border: `1px solid ${M.border}`,
											borderRadius: "14px",
											p: 3,
											minHeight: 280,
										}}
									>
										<Typography
											sx={{
												color: M.textMuted,
												fontSize: "0.68rem",
												fontWeight: 700,
												letterSpacing: "0.12em",
												textTransform: "uppercase",
												mb: 2.5,
											}}
										>
											Unresolved by Category
										</Typography>

										{Object.keys(d.unresolvedByCategory ?? {}).length === 0 ? (
											<Box
												sx={{
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													justifyContent: "center",
													height: 180,
													gap: 1,
												}}
											>
												<CheckCircleOutlineIcon sx={{ color: M.green, fontSize: "2.5rem" }} />
												<Typography sx={{ color: M.green, fontWeight: 700, fontSize: "0.9rem" }}>All clear!</Typography>
												<Typography sx={{ color: M.textMuted, fontSize: "0.75rem" }}>No unresolved issues</Typography>
											</Box>
										) : (
											<Stack spacing={2}>
												{Object.entries(d.unresolvedByCategory).map(([cat, count]) => (
													<Box key={cat}>
														<Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
															<Stack direction="row" alignItems="center" spacing={1}>
																<Box
																	sx={{
																		width: 8,
																		height: 8,
																		borderRadius: "2px",
																		bgcolor: CATEGORY_COLORS[cat] ?? M.textMuted,
																	}}
																/>
																<Typography sx={{ color: M.text, fontSize: "0.82rem", fontWeight: 600 }}>
																	{cap(cat)}
																</Typography>
															</Stack>
															<Chip
																label={`${count} unresolved`}
																size="small"
																sx={{
																	bgcolor: `${M.rose}15`,
																	color: M.rose,
																	fontSize: "0.68rem",
																	height: 20,
																	fontWeight: 700,
																	border: `1px solid ${M.rose}30`,
																}}
															/>
														</Stack>
														<LinearProgress
															variant="determinate"
															value={100}
															sx={{
																height: 5,
																borderRadius: 3,
																bgcolor: M.border,
																"& .MuiLinearProgress-bar": { bgcolor: M.rose, borderRadius: 3 },
															}}
														/>
													</Box>
												))}

												{/* Category volume breakdown */}
												<Box sx={{ mt: 1, pt: 2, borderTop: `1px solid ${M.border}` }}>
													<Typography
														sx={{ color: M.textMuted, fontSize: "0.68rem", mb: 1.5, letterSpacing: "0.08em" }}
													>
														ALL CATEGORY VOLUMES
													</Typography>
													{categoryData.map((cat) => (
														<Stack
															key={cat.name}
															direction="row"
															justifyContent="space-between"
															alignItems="center"
															sx={{ mb: 0.8 }}
														>
															<Stack direction="row" alignItems="center" spacing={0.8}>
																<Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: cat.color }} />
																<Typography sx={{ color: M.textMuted, fontSize: "0.72rem" }}>{cat.name}</Typography>
															</Stack>
															<Typography sx={{ color: cat.color, fontSize: "0.72rem", fontWeight: 700 }}>
																{cat.value}
															</Typography>
														</Stack>
													))}
												</Box>
											</Stack>
										)}
									</Card>
								</Grid>
							</Grid>

							{/* ── Summary strip ──────────────────────────────────────────── */}
							<Box
								sx={{
									mt: 2,
									p: "16px 24px",
									bgcolor: M.surface,
									border: `1px solid ${M.border}`,
									borderRadius: "12px",
									display: "flex",
									flexWrap: "wrap",
									gap: 3,
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								{[
									{
										label: "Calls / Client",
										value: fmt(d.totalCalls / Math.max(d.totalUniqueClients, 1), 1),
										color: M.teal,
									},
									{ label: "Avg Duration", value: `${fmt(d.averageCallDurationMinutes, 1)} min`, color: M.sky },
									{
										label: "Active Rate",
										value: `${fmt((d.activeCalls / Math.max(d.totalCalls, 1)) * 100)}%`,
										color: M.amber,
									},
									{
										label: "Issue Rate",
										value: `${fmt(((d.issuesResolved + d.issuesPending) / Math.max(d.totalCalls, 1)) * 100)}%`,
										color: M.rose,
									},
									{ label: "Satisfaction", value: `${fmt(d.averageSatisfactionRating)} / 5`, color: M.gold },
								].map((m) => (
									<Box key={m.label} sx={{ textAlign: "center" }}>
										<Typography sx={{ color: m.color, fontWeight: 800, fontSize: "1.3rem", lineHeight: 1 }}>
											{m.value}
										</Typography>
										<Typography sx={{ color: M.textMuted, fontSize: "0.65rem", letterSpacing: "0.08em" }}>
											{m.label}
										</Typography>
									</Box>
								))}
								<Typography sx={{ color: M.textFaint, fontSize: "0.68rem", ml: "auto" }}>
									CallPulse · {days}-day window
								</Typography>
							</Box>
						</Box>
					</Fade>
				)}
			</Box>
		</Box>
	);
}

// "use client";

// import * as React from "react";
// import { useRouter } from "next/navigation";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import Alert from "@mui/material/Alert";
// import CircularProgress from "@mui/material/CircularProgress";

// import { useAnalyticsDashboard } from "@/lib/react-query/analytics.queries";
// import { KpiCard } from "@/components/dashboard/analytics/kpi-card";
// import { DaysSelector } from "@/components/dashboard/analytics/days-selector";
// import { DailyVolumeChart } from "@/components/dashboard/analytics/daily-volume-chart";
// import { SentimentBreakdown } from "@/components/dashboard/analytics/sentiment-breakdown";
// import { CategoryBreakdown } from "@/components/dashboard/analytics/category-breakdown";
// import { UnresolvedByCategory } from "@/components/dashboard/analytics/unresolved-by-category";

// export default function AnalyticsDashboardPage(): React.JSX.Element {
//   // const router = useRouter();
//   const [days, setDays] = React.useState<number>(30);

//   const { data: response, isLoading, error } = useAnalyticsDashboard(days);

//   // React.useEffect(() => {
//   //   if (error && ((error as any)?.status === 401 || (error as any)?.status === 403 || (error as any)?.response?.status === 401)) {
//   //     router.push("/auth/sign-in");
//   //   }
//   // }, [error, router]);

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
//   //       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//   //         <div>
//   //           <Typography variant="h4">Analytics Dashboard</Typography>
//   //           <Typography color="text.secondary">Admin & Supervisor View</Typography>
//   //         </div>
//   //         <DaysSelector days={days} onChange={setDays} />
//   //       </Box>
//   //       <Alert severity="error">
//   //         Failed to load analytics data. {(error as any)?.message || response?.message || "Please check your permissions and try again."}
//   //       </Alert>
//   //     </Stack>
//   //   );
//   // }

//   const data = response?.data;
//   console.log("DATA2", data)
//   // if (!data) return <div />;

//   return (
//     <Stack spacing={4}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
//         <div>
//           <Typography variant="h4">Call Analytics</Typography>
//           <Typography color="text.secondary" variant="body1">Admin & Supervisor View</Typography>
//         </div>
//         <DaysSelector days={days} onChange={setDays} />
//       </Box>

//       <Grid container spacing={3}>
//         <Grid size={{ xs: 6, md: 3 }}>
//           <KpiCard title="Total Calls" value={data?.totalCalls} />
//         </Grid>
//         <Grid size={{ xs: 6, md: 3 }}>
//           <KpiCard title="Active Calls" value={data?.activeCalls} accentColor="info" />
//         </Grid>
//         <Grid size={{ xs: 6, md: 3 }}>
//           <KpiCard title="Ended Calls" value={data?.endedCalls} accentColor="secondary" />
//         </Grid>
//         <Grid size={{ xs: 6, md: 3 }}>
//           <KpiCard title="Total Unique Clients" value={data?.totalUniqueClients} />
//         </Grid>
//         <Grid size={{ xs: 6, md: 3 }}>
//           <KpiCard title="Issues Resolved" value={data?.issuesResolved} accentColor="success" />
//         </Grid>
//         <Grid size={{ xs: 6, md: 3 }}>
//           <KpiCard title="Issues Pending" value={data?.issuesPending} accentColor="error" />
//         </Grid>
//         <Grid size={{ xs: 6, md: 3 }}>
//           <KpiCard
//             title="Resolution Rate"
//             value={`${data?.resolutionRate?.toFixed(1) || 0}%`}
//             subtitle={
//               <Box sx={{ height: 4, width: '100%', bgcolor: 'action.hover', mt: 1, borderRadius: 1, overflow: 'hidden' }}>
//                 <Box sx={{ height: '100%', width: `${data?.resolutionRate || 0}%`, bgcolor: 'success.main' }} />
//               </Box>
//             }
//           />
//         </Grid>
//         <Grid size={{ xs: 6, md: 3 }}>
//           <KpiCard
//             title="Avg Satisfaction"
//             value={data?.averageSatisfactionRating ? `${data?.averageSatisfactionRating.toFixed(1)}★` : "N/A"}
//           />
//         </Grid>
//       </Grid>

//       <Box sx={{ maxWidth: 300 }}>
//         <KpiCard
//           title="Avg Call Duration"
//           value={data?.averageCallDurationMinutes ? `${data?.averageCallDurationMinutes.toFixed(1)} min` : "N/A"}
//         />
//       </Box>

//       <DailyVolumeChart data={data?.dailyCallVolume || {}} />

//       <SentimentBreakdown counts={data?.callsBySentiment || {}} percentages={data?.sentimentPercentages || {}} />

//       <Grid container spacing={3}>
//         <Grid size={{ xs: 12, lg: 6 }}>
//           <CategoryBreakdown counts={data?.callsByCategory || {}} percentages={data?.categoryPercentages || {}} />
//         </Grid>
//         <Grid size={{ xs: 12, lg: 6 }}>
//           <UnresolvedByCategory data={data?.unresolvedByCategory || {}} />
//         </Grid>
//       </Grid>
//     </Stack>
//   );
// }
