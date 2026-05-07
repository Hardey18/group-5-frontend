"use client";

import React from "react";
import {
	Alert,
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Fade,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	LinearProgress,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import { SirenIcon } from "@phosphor-icons/react/dist/ssr/Siren";

import { M } from "@/config/mtn-tokens";
import { useAllChannels } from "@/lib/react-query/get-all-channels.queries";
import { useAllChurn } from "@/lib/react-query/get-all-predictions.queries";

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
			<Box sx={{ width: 3, height: 20, bgcolor: M.yellow, borderRadius: 2 }} />
			<Typography sx={{ color: M.text, fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.01em" }}>
				{children}
			</Typography>
			<Box sx={{ flex: 1, height: "1px", bgcolor: M.border }} />
		</Box>
	);
}

export default function ChurnList() {
	const { data } = useAllChurn(1, 100);

	const [channel, setChannel] = React.useState("");
	const [offer, setOffer] = React.useState("");

	const handleChannel = (event: SelectChangeEvent) => {
		setChannel(event.target.value as string);
	};
	const handleOffer = (event: SelectChangeEvent) => {
		setOffer(event.target.value as string);
	};
	return (
		<div>
			{/* <Typography variant='h2'>Churn List</Typography> */}

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
						<SirenIcon sx={{ color: M.black, fontSize: "1.15rem" }} />
					</Box>
					<Box>
						<Typography
							sx={{ fontWeight: 800, fontSize: "1rem", color: M.black, lineHeight: 1, letterSpacing: "-0.01em" }}
						>
							Churn List
						</Typography>
						<Typography sx={{ color: M.textMuted, fontSize: "0.6rem", letterSpacing: "0.12em" }}>
							CHURN CUSTOMERS
						</Typography>
					</Box>
				</Stack>
			</Stack>

			{/* ── Table ── */}
			{/* <SectionTitle>Customer Intelligence Table</SectionTitle> */}
			<Card
				sx={{
					bgcolor: M.surface,
					border: `1px solid ${M.border}`,
					borderRadius: "14px",
					overflow: "hidden",
					boxShadow: M.shadow,
					marginTop: "2rem",
				}}
			>
				<TableContainer sx={{ maxHeight: 720 }}>
					<Table stickyHeader size="medium">
						<TableHead>
							<TableRow>
								{["Customer ID", "Segment", "Complaint", "Select Channel", "Select Offer", "Action"].map((h) => (
									<TableCell
										key={h}
										sx={{
											bgcolor: M.surfaceAlt,
											color: M.textMuted,
											fontSize: "0.65rem",
											fontWeight: 700,
											letterSpacing: "0.08em",
											textTransform: "uppercase",
											borderBottom: `2px solid ${M.border}`,
										}}
									>
										{h}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.predictions?.slice(0, 20).map((p) => {
								return (
									<TableRow
										key={p.id}
										sx={{ "&:hover": { bgcolor: M.yellowDim }, "& td": { borderBottom: `1px solid ${M.border}` } }}
									>
										<TableCell sx={{ color: M.textSoft, fontSize: "0.8rem", fontWeight: 600 }}>
											#{p.customerId}
										</TableCell>
										<TableCell>
											<Chip
												label={p.customerType}
												size="small"
												sx={{
													bgcolor: `${SEGMENT_COLORS[p.customerType]}15`,
													color: SEGMENT_COLORS[p.customerType],
													fontSize: "0.68rem",
													height: 20,
													fontWeight: 600,
												}}
											/>
										</TableCell>
										<TableCell
											sx={{
												color: M.textMuted,
												fontSize: "0.72rem",
												maxWidth: 120,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{p.complaintText === "None" ? <span style={{ color: M.border }}>—</span> : p.complaintText}
										</TableCell>
										<TableCell
											sx={{
												color: M.textMuted,
												fontSize: "0.72rem",
												maxWidth: 120,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											<FormControl fullWidth>
												<InputLabel id="simple-channel-label">Channel</InputLabel>
												<Select
													labelId="channel-label"
													id="channel"
													value={channel}
													label="Channel"
													onChange={handleChannel}
                                                    key={channel}
												>
													<MenuItem value="sms">SMS</MenuItem>
													<MenuItem value="email">Email</MenuItem>
													<MenuItem value="whatsapp">WhatsApp</MenuItem>
													<MenuItem value="push">Push Notification</MenuItem>
												</Select>
											</FormControl>
										</TableCell>
										<TableCell
											sx={{
												color: M.textMuted,
												fontSize: "0.72rem",
												maxWidth: 120,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											<FormControl fullWidth>
												<InputLabel id="simple-offer-label">Offer</InputLabel>
												<Select
													labelId="offer-label"
													id="offer"
													value={offer}
													label="Offer"
													onChange={handleOffer}
                                                    key={offer}
												>
													<MenuItem value="data" key="offer-1">Data Bundle Discounted</MenuItem>
													<MenuItem value="airtime" key="offer-2">Airtime Bundle Discounted</MenuItem>
													<MenuItem value="free-data" key="free-data">Free Data - 30 Days</MenuItem>
													<MenuItem value="free-airtime" key="free-airtime">Free Airtime</MenuItem>
												</Select>
											</FormControl>
										</TableCell>
										<TableCell
											sx={{
												color: M.textMuted,
												fontSize: "0.72rem",
												maxWidth: 120,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											<Button variant="contained" style={{ background: M.yellowDark }}>Submit</Button>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Card>
		</div>
	);
}

const getAIAction = (p: Prediction) => {
	if (p.churnRiskScore > 0.7 && p.hasComplaint === 1) return "Reactive";
	if (p.churnRiskScore > 0.7 && p.hasComplaint === 0) return "Proactive";
	return "Monitor";
};

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

const fmt = (n: number, d = 2) => n.toFixed(d);
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

const getRiskLevel = (s: number): "low" | "medium" | "high" => (s < 0.3 ? "low" : s <= 0.6 ? "medium" : "high");

const SEGMENT_COLORS: Record<string, string> = {
	Healthy: M.success,
	"Silent Churn": M.warning,
	"Vocal Churn": M.danger,
};
