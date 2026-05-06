"use client";

import * as React from "react";
import { D } from "@/app/dashboard/client/config/client-design-tokens";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { CaretDown, CaretUp, CheckCircle, Clock, PhoneCall, XCircle } from "@phosphor-icons/react";
import dayjs from "dayjs";

import { CallDTO } from "@/types/client-dashboard";

// ─── Status helpers ────────────────────────────────────────────────────────────
function StatusChip({ status }: { status: string }) {
	const isActive = status.toLowerCase() === "active";
	return (
		<Box
			sx={{
				display: "inline-flex",
				alignItems: "center",
				gap: 0.5,
				px: 1.25,
				py: 0.35,
				borderRadius: "20px",
				bgcolor: isActive ? `${D.teal}18` : `${D.textMuted}12`,
				border: `1px solid ${isActive ? D.teal + "44" : D.border}`,
			}}
		>
			<Box
				sx={{
					width: 5,
					height: 5,
					borderRadius: "50%",
					bgcolor: isActive ? D.teal : D.textMuted,
					...(isActive && {
						animation: "pulse 2s ease-in-out infinite",
						"@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } },
					}),
				}}
			/>
			<Typography
				component="span"
				sx={{ fontSize: "0.7rem", fontWeight: 700, color: isActive ? D.teal : D.textMuted, letterSpacing: "0.06em" }}
			>
				{status.toUpperCase()}
			</Typography>
		</Box>
	);
}

function ResolvedChip({ resolved }: { resolved: boolean }) {
	return (
		<Box
			sx={{
				display: "inline-flex",
				alignItems: "center",
				gap: 0.5,
				px: 1.25,
				py: 0.35,
				borderRadius: "20px",
				bgcolor: resolved ? `${D.green}15` : `${D.rose}15`,
				border: `1px solid ${resolved ? D.green + "44" : D.rose + "44"}`,
			}}
		>
			{resolved ? (
				<CheckCircle size={12} color={D.green} weight="fill" />
			) : (
				<XCircle size={12} color={D.rose} weight="fill" />
			)}
			<Typography
				component="span"
				sx={{ fontSize: "0.7rem", fontWeight: 700, color: resolved ? D.green : D.rose, letterSpacing: "0.04em" }}
			>
				{resolved ? "Resolved" : "Pending"}
			</Typography>
		</Box>
	);
}

// ─── Expandable row ────────────────────────────────────────────────────────────
function CallRow({ call, index }: { call: CallDTO; index: number }) {
	const [open, setOpen] = React.useState(false);

	return (
		<React.Fragment>
			<TableRow
				hover
				onClick={() => setOpen(!open)}
				sx={{
					cursor: "pointer",
					animation: "fadeIn 0.4s ease both",
					animationDelay: `${index * 0.05}s`,
					"@keyframes fadeIn": {
						from: { opacity: 0, transform: "translateY(6px)" },
						to: { opacity: 1, transform: "none" },
					},
					bgcolor: open ? `${D.teal}06` : "transparent",
					"& td": { borderBottom: `1px solid ${open ? D.teal + "20" : D.border}`, transition: "border-color 0.2s" },
					"&:hover": { bgcolor: `${D.teal}06` },
					"&:hover td": { borderBottomColor: `${D.teal}20` },
				}}
			>
				<TableCell sx={{ width: 44, pl: 2 }}>
					<IconButton
						size="small"
						onClick={(e) => {
							e.stopPropagation();
							setOpen(!open);
						}}
						sx={{
							width: 26,
							height: 26,
							bgcolor: open ? `${D.teal}20` : D.surfaceAlt,
							border: `1px solid ${open ? D.teal + "50" : D.border}`,
							borderRadius: "7px",
							color: open ? D.teal : D.textMuted,
							transition: "all 0.2s",
							"&:hover": { bgcolor: `${D.teal}20`, color: D.teal, borderColor: D.teal + "50" },
						}}
					>
						{open ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />}
					</IconButton>
				</TableCell>

				<TableCell>
					<Stack direction="row" alignItems="center" spacing={1}>
						<Box
							sx={{
								width: 28,
								height: 28,
								borderRadius: "8px",
								bgcolor: `${D.indigo}18`,
								border: `1px solid ${D.indigo}30`,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<PhoneCall size={13} color={D.indigo} weight="fill" />
						</Box>
						<Box>
							<Typography sx={{ color: D.text, fontSize: "0.8rem", fontWeight: 600 }}>
								{dayjs(call.startTime).format("MMM DD, YYYY")}
							</Typography>
							<Typography sx={{ color: D.textMuted, fontSize: "0.68rem" }}>
								{dayjs(call.startTime).format("hh:mm A")}
							</Typography>
						</Box>
					</Stack>
				</TableCell>

				<TableCell>
					{call.endTime ? (
						<Box>
							<Typography sx={{ color: D.text, fontSize: "0.78rem" }}>
								{dayjs(call.endTime).format("MMM DD, YYYY")}
							</Typography>
							<Typography sx={{ color: D.textMuted, fontSize: "0.68rem" }}>
								{dayjs(call.endTime).format("hh:mm A")}
							</Typography>
						</Box>
					) : (
						<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
							<Clock size={12} color={D.teal} weight="fill" />
							<Typography component="span" sx={{ color: D.teal, fontSize: "0.75rem", fontWeight: 600 }}>
								Ongoing
							</Typography>
						</Box>
					)}
				</TableCell>

				<TableCell>
					<StatusChip status={call.status} />
				</TableCell>
				<TableCell>
					<ResolvedChip resolved={call.isResolved} />
				</TableCell>

				<TableCell>
					{call.satisfactionRating ? (
						<Stack direction="row" alignItems="center" spacing={1}>
							<Rating
								value={call.satisfactionRating}
								readOnly
								size="small"
								sx={{
									"& .MuiRating-iconFilled": { color: D.gold },
									"& .MuiRating-iconEmpty": { color: D.border },
								}}
							/>
							<Typography sx={{ color: D.gold, fontSize: "0.72rem", fontWeight: 700 }}>
								{call.satisfactionRating}
							</Typography>
						</Stack>
					) : (
						<Typography sx={{ color: D.textMuted, fontSize: "0.75rem" }}>—</Typography>
					)}
				</TableCell>
			</TableRow>

			{/* Expanded detail */}
			<TableRow sx={{ "& td": { borderBottom: open ? `1px solid ${D.border}` : "none", p: 0 } }}>
				<TableCell colSpan={6} sx={{ p: "0 !important" }}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box
							sx={{
								mx: 2,
								my: 1.5,
								borderRadius: "12px",
								border: `1px solid ${D.border}`,
								bgcolor: D.surface,
								overflow: "hidden",
							}}
						>
							{/* Transcript */}
							<Box sx={{ p: 2.5, borderBottom: `1px solid ${D.border}` }}>
								<Typography
									sx={{
										color: D.textMuted,
										fontSize: "0.65rem",
										fontWeight: 700,
										letterSpacing: "0.1em",
										textTransform: "uppercase",
										mb: 1.5,
									}}
								>
									Transcript
								</Typography>
								<Box
									sx={{
										maxHeight: 180,
										overflow: "auto",
										bgcolor: D.bg,
										borderRadius: "8px",
										p: 2,
										border: `1px solid ${D.border}`,
										scrollbarWidth: "thin",
										scrollbarColor: `${D.border} transparent`,
									}}
								>
									<Typography
										sx={{
											color: D.textMuted,
											fontSize: "0.8rem",
											lineHeight: 1.7,
											whiteSpace: "pre-wrap",
											fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
										}}
									>
										{call.transcript || "No transcript available."}
									</Typography>
								</Box>
							</Box>

							{/* Follow-up messages */}
							<Box sx={{ p: 2.5 }}>
								<Typography
									sx={{
										color: D.textMuted,
										fontSize: "0.65rem",
										fontWeight: 700,
										letterSpacing: "0.1em",
										textTransform: "uppercase",
										mb: 1.5,
									}}
								>
									Follow-up Messages
								</Typography>
								{call.followUpMessages && call.followUpMessages.length > 0 ? (
									<Table size="small">
										<TableHead>
											<TableRow
												sx={{
													"& th": {
														borderBottom: `1px solid ${D.border}`,
														color: D.textMuted,
														fontSize: "0.65rem",
														fontWeight: 700,
														letterSpacing: "0.08em",
														textTransform: "uppercase",
														py: 1,
													},
												}}
											>
												<TableCell>Type</TableCell>
												<TableCell>Content</TableCell>
												<TableCell>Sent At</TableCell>
												<TableCell>Delivery</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{call.followUpMessages.map((msg) => (
												<TableRow key={msg.id} sx={{ "& td": { borderBottom: `1px solid ${D.border}40`, py: 1 } }}>
													<TableCell>
														<Typography sx={{ color: D.text, fontSize: "0.75rem", fontWeight: 600 }}>
															{msg.type}
														</Typography>
													</TableCell>
													<TableCell sx={{ maxWidth: 360 }}>
														<Typography
															sx={{
																color: D.textMuted,
																fontSize: "0.75rem",
																overflow: "hidden",
																textOverflow: "ellipsis",
																whiteSpace: "nowrap",
															}}
														>
															{msg.content}
														</Typography>
													</TableCell>
													<TableCell>
														<Typography sx={{ color: D.textMuted, fontSize: "0.72rem" }}>
															{msg.sentAt ? dayjs(msg.sentAt).format("MMM DD, HH:mm") : "—"}
														</Typography>
													</TableCell>
													<TableCell>
														<Box
															sx={{
																display: "inline-block",
																px: 1,
																py: 0.25,
																borderRadius: "20px",
																fontSize: "0.65rem",
																fontWeight: 700,
																letterSpacing: "0.06em",
																bgcolor:
																	msg.deliveryStatus?.toLowerCase() === "delivered"
																		? `${D.green}15`
																		: `${D.textMuted}12`,
																color: msg.deliveryStatus?.toLowerCase() === "delivered" ? D.green : D.textMuted,
																border: `1px solid ${msg.deliveryStatus?.toLowerCase() === "delivered" ? D.green + "40" : D.border}`,
															}}
														>
															{(msg.deliveryStatus || "Pending").toUpperCase()}
														</Box>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								) : (
									<Typography sx={{ color: D.textMuted, fontSize: "0.78rem", fontStyle: "italic" }}>
										No follow-up messages.
									</Typography>
								)}
							</Box>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

// ─── Table ─────────────────────────────────────────────────────────────────────
export interface CallHistoryTableProps {
	calls?: CallDTO[];
}

export function CallHistoryTable({ calls = [] }: CallHistoryTableProps): React.JSX.Element {
	return (
		<Box>
			{/* Header */}
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
				<Stack direction="row" alignItems="center" spacing={1.5}>
					<Box sx={{ width: 3, height: 20, bgcolor: D.teal, borderRadius: 2 }} />
					<Typography sx={{ color: D.text, fontWeight: 700, fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
						Call History
					</Typography>
					{calls.length > 0 && (
						<Box
							sx={{ px: 1.25, py: 0.2, bgcolor: `${D.teal}15`, border: `1px solid ${D.teal}30`, borderRadius: "20px" }}
						>
							<Typography sx={{ color: D.teal, fontSize: "0.68rem", fontWeight: 700 }}>{calls.length}</Typography>
						</Box>
					)}
				</Stack>
			</Stack>

			<Box
				sx={{
					bgcolor: D.surface,
					border: `1px solid ${D.border}`,
					borderRadius: "16px",
					overflow: "hidden",
				}}
			>
				<Box sx={{ overflowX: "auto" }}>
					<Table sx={{ minWidth: 800 }}>
						<TableHead>
							<TableRow sx={{ bgcolor: D.surfaceAlt }}>
								<TableCell sx={{ width: 44, borderBottom: `1px solid ${D.border}`, py: 1.5 }} />
								{["Start Time", "End Time", "Status", "Resolved", "Satisfaction"].map((h) => (
									<TableCell
										key={h}
										sx={{
											borderBottom: `1px solid ${D.border}`,
											color: D.textMuted,
											fontSize: "0.65rem",
											fontWeight: 700,
											letterSpacing: "0.1em",
											textTransform: "uppercase",
											py: 1.5,
										}}
									>
										{h}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{calls.length > 0 ? (
								calls.map((call, i) => <CallRow key={call.id} call={call} index={i} />)
							) : (
								<TableRow>
									<TableCell colSpan={6} sx={{ borderBottom: "none", py: 6 }}>
										<Stack alignItems="center" spacing={1.5}>
											<PhoneCall size={36} color={D.textMuted} weight="thin" />
											<Typography sx={{ color: D.textMuted, fontSize: "0.82rem" }}>No calls found</Typography>
										</Stack>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</Box>
			</Box>
		</Box>
	);
}

// "use client";

// import * as React from "react";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardHeader from "@mui/material/CardHeader";
// import Chip from "@mui/material/Chip";
// import Collapse from "@mui/material/Collapse";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import Rating from "@mui/material/Rating";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Typography from "@mui/material/Typography";
// import dayjs from "dayjs";
// import { CaretDown, CaretUp } from "@phosphor-icons/react";
// import { CallDTO } from "@/types/client-dashboard";

// interface CallRowProps {
//   call: CallDTO;
// }

// function CallRow({ call }: CallRowProps): React.JSX.Element {
//   const [open, setOpen] = React.useState(false);

//   return (
//     <React.Fragment>
//       <TableRow hover>
//         <TableCell>
//           <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
//             {open ? <CaretUp /> : <CaretDown />}
//           </IconButton>
//         </TableCell>
//         <TableCell>
//           <Typography variant="body2">{dayjs(call.startTime).format("MMM DD, YYYY, hh:mm A")}</Typography>
//         </TableCell>
//         <TableCell>
//           <Typography variant="body2">
//             {call.endTime ? dayjs(call.endTime).format("MMM DD, YYYY, hh:mm A") : "Ongoing"}
//           </Typography>
//         </TableCell>
//         <TableCell>
//           <Chip
//             label={call.status}
//             color={call.status.toLowerCase() === "active" ? "primary" : "default"}
//             size="small"
//           />
//         </TableCell>
//         <TableCell>
//           <Chip label={call.isResolved ? "Yes" : "No"} color={call.isResolved ? "success" : "error"} size="small" />
//         </TableCell>
//         <TableCell>
//           {call.satisfactionRating ? <Rating value={call.satisfactionRating} readOnly size="small" /> : <Typography variant="body2">N/A</Typography>}
//         </TableCell>
//       </TableRow>
//       <TableRow>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom component="div">
//                 Details
//               </Typography>
//               <Typography variant="subtitle2" gutterBottom>
//                 Transcript
//               </Typography>
//               <Box sx={{ maxHeight: 200, overflow: 'auto', mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
//                 <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
//                   {call.transcript || "No transcript available."}
//                 </Typography>
//               </Box>

//               <Typography variant="subtitle2" gutterBottom>
//                 Follow-up Messages
//               </Typography>
//               {call.followUpMessages && call.followUpMessages.length > 0 ? (
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Type</TableCell>
//                       <TableCell>Content</TableCell>
//                       <TableCell>Sent At</TableCell>
//                       <TableCell>Delivery Status</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {call.followUpMessages.map((msg) => (
//                       <TableRow key={msg.id}>
//                         <TableCell>{msg.type}</TableCell>
//                         <TableCell sx={{ maxWidth: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                           {msg.content}
//                         </TableCell>
//                         <TableCell>{msg.sentAt ? dayjs(msg.sentAt).format("MMM DD HH:mm") : "N/A"}</TableCell>
//                         <TableCell>
//                           <Chip label={msg.deliveryStatus || "Pending"} size="small" />
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <Typography variant="body2" color="text.secondary">
//                   No follow-up messages.
//                 </Typography>
//               )}
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </React.Fragment>
//   );
// }

// export interface CallHistoryTableProps {
//   calls?: CallDTO[];
// }

// export function CallHistoryTable({ calls = [] }: CallHistoryTableProps): React.JSX.Element {
//   return (
//     <Card>
//       <CardHeader title="Call History" />
//       <Divider />
//       <Box sx={{ overflowX: "auto" }}>
//         <Table sx={{ minWidth: 800 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell />
//               <TableCell>Start Time</TableCell>
//               <TableCell>End Time</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Resolved</TableCell>
//               <TableCell>Satisfaction</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {calls && calls.length > 0 ? (
//               calls.map((call) => <CallRow key={call.id} call={call} />)
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
//                     No calls found
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </Box>
//     </Card>
//   );
// }
