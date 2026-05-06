"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { CaretDown, CaretUp, ChatText, SmileyAngry, SmileySad, SmileyMeh, SmileyWink } from "@phosphor-icons/react";
import { UserRequestDTO } from "@/types/client-dashboard";
import { D } from "@/app/dashboard/client/config/client-design-tokens";

// ─── Sentiment helpers ─────────────────────────────────────────────────────────
const SENTIMENT_MAP: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  positive:   { color: D.green,  icon: <SmileyWink  size={13} weight="fill" />, label: "Positive" },
  neutral:    { color: D.sky,    icon: <SmileyMeh   size={13} weight="fill" />, label: "Neutral" },
  frustrated: { color: D.amber,  icon: <SmileySad   size={13} weight="fill" />, label: "Frustrated" },
  angry:      { color: D.rose,   icon: <SmileyAngry size={13} weight="fill" />, label: "Angry" },
};

function SentimentBadge({ sentiment }: { sentiment: string | null }) {
  const key = sentiment?.toLowerCase() ?? "";
  const cfg = SENTIMENT_MAP[key] ?? { color: D.textMuted, icon: <SmileyMeh size={13} />, label: sentiment || "Unknown" };
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1.25,
        py: 0.35,
        borderRadius: "20px",
        bgcolor: `${cfg.color}15`,
        border: `1px solid ${cfg.color}44`,
        color: cfg.color,
      }}
    >
      {cfg.icon}
      <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: cfg.color, letterSpacing: "0.04em" }}>
        {cfg.label}
      </Typography>
    </Box>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status?.toLowerCase() ?? "pending";
  const color = s === "resolved" || s === "completed" ? D.green
    : s === "pending" ? D.amber
    : D.textMuted;
  return (
    <Box
      sx={{
        display: "inline-flex",
        px: 1.25,
        py: 0.35,
        borderRadius: "20px",
        bgcolor: `${color}15`,
        border: `1px solid ${color}44`,
      }}
    >
      <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {status || "Pending"}
      </Typography>
    </Box>
  );
}

function CategoryTag({ value }: { value: string | null }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        px: 1.25,
        py: 0.3,
        borderRadius: "6px",
        bgcolor: `${D.indigo}15`,
        border: `1px solid ${D.indigo}28`,
      }}
    >
      <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: D.indigo, letterSpacing: "0.04em" }}>
        {value || "N/A"}
      </Typography>
    </Box>
  );
}

// ─── Expandable row ────────────────────────────────────────────────────────────
function RequestRow({ request, index }: { request: UserRequestDTO; index: number }) {
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
          "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "none" } },
          bgcolor: open ? `${D.indigo}06` : "transparent",
          "& td": { borderBottom: `1px solid ${open ? D.indigo + "20" : D.border}`, transition: "border-color 0.2s" },
          "&:hover": { bgcolor: `${D.indigo}06` },
          "&:hover td": { borderBottomColor: `${D.indigo}20` },
        }}
      >
        <TableCell sx={{ width: 44, pl: 2 }}>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
            sx={{
              width: 26, height: 26,
              bgcolor: open ? `${D.indigo}20` : D.surfaceAlt,
              border: `1px solid ${open ? D.indigo + "50" : D.border}`,
              borderRadius: "7px",
              color: open ? D.indigo : D.textMuted,
              transition: "all 0.2s",
              "&:hover": { bgcolor: `${D.indigo}20`, color: D.indigo, borderColor: D.indigo + "50" },
            }}
          >
            {open ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />}
          </IconButton>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 28, height: 28, borderRadius: "8px", bgcolor: `${D.teal}15`, border: `1px solid ${D.teal}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChatText size={13} color={D.teal} weight="fill" />
            </Box>
            <Box>
              <Typography sx={{ color: D.text, fontSize: "0.8rem", fontWeight: 600 }}>
                {dayjs(request.createdAt).format("MMM DD, YYYY")}
              </Typography>
              <Typography sx={{ color: D.textMuted, fontSize: "0.68rem" }}>
                {dayjs(request.createdAt).format("hh:mm A")}
              </Typography>
            </Box>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography sx={{ color: D.text, fontSize: "0.8rem", fontWeight: 600 }}>{request.type || "—"}</Typography>
        </TableCell>

        <TableCell><CategoryTag value={request.category} /></TableCell>
        <TableCell><SentimentBadge sentiment={request.sentiment} /></TableCell>
        <TableCell><StatusBadge status={request.status} /></TableCell>
      </TableRow>

      {/* Expanded detail */}
      <TableRow sx={{ "& td": { borderBottom: open ? `1px solid ${D.border}` : "none", p: 0 } }}>
        <TableCell colSpan={6} sx={{ p: "0 !important" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                mx: 2, my: 1.5,
                borderRadius: "12px",
                border: `1px solid ${D.border}`,
                bgcolor: D.surface,
                overflow: "hidden",
              }}
            >
              {[
                { label: "Content", value: request.content },
                { label: "Summary", value: request.summary },
                { label: "Response", value: request.response },
              ].map((section, i, arr) => (
                <Box
                  key={section.label}
                  sx={{
                    p: 2.5,
                    borderBottom: i < arr.length - 1 ? `1px solid ${D.border}` : "none",
                  }}
                >
                  <Typography
                    sx={{
                      color: D.textMuted,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      mb: 1,
                    }}
                  >
                    {section.label}
                  </Typography>
                  <Typography sx={{ color: section.value ? D.text : D.textMuted, fontSize: "0.82rem", lineHeight: 1.65, fontStyle: section.value ? "normal" : "italic" }}>
                    {section.value || `No ${section.label.toLowerCase()} yet.`}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// ─── Table ─────────────────────────────────────────────────────────────────────
export interface RequestHistoryTableProps {
  requests?: UserRequestDTO[];
}

export function RequestHistoryTable({ requests = [] }: RequestHistoryTableProps): React.JSX.Element {
  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ width: 3, height: 20, bgcolor: D.indigo, borderRadius: 2 }} />
          <Typography sx={{ color: D.text, fontWeight: 700, fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
            Request History
          </Typography>
          {requests.length > 0 && (
            <Box sx={{ px: 1.25, py: 0.2, bgcolor: `${D.indigo}15`, border: `1px solid ${D.indigo}30`, borderRadius: "20px" }}>
              <Typography sx={{ color: D.indigo, fontSize: "0.68rem", fontWeight: 700 }}>{requests.length}</Typography>
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
                {["Date", "Type", "Category", "Sentiment", "Status"].map((h) => (
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
              {requests.length > 0 ? (
                requests.map((req, i) => <RequestRow key={req.id} request={req} index={i} />)
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ borderBottom: "none", py: 6 }}>
                    <Stack alignItems="center" spacing={1.5}>
                      <ChatText size={36} color={D.textMuted} weight="thin" />
                      <Typography sx={{ color: D.textMuted, fontSize: "0.82rem" }}>No requests found</Typography>
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
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Typography from "@mui/material/Typography";
// import dayjs from "dayjs";
// import { CaretDown, CaretUp } from "@phosphor-icons/react";
// import { UserRequestDTO } from "@/types/client-dashboard";

// function getSentimentColor(sentiment: string | null) {
//   const norm = sentiment?.toLowerCase();
//   switch (norm) {
//     case "positive":
//       return "success";
//     case "neutral":
//       return "default";
//     case "frustrated":
//       return "warning";
//     case "angry":
//       return "error";
//     default:
//       return "default";
//   }
// }

// interface RequestRowProps {
//   request: UserRequestDTO;
// }

// function RequestRow({ request }: RequestRowProps): React.JSX.Element {
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
//           <Typography variant="body2">{dayjs(request.createdAt).format("MMM DD, YYYY, hh:mm A")}</Typography>
//         </TableCell>
//         <TableCell>{request.type || "N/A"}</TableCell>
//         <TableCell>{request.category || "N/A"}</TableCell>
//         <TableCell>
//           <Chip label={request.sentiment || "Unknown"} color={getSentimentColor(request.sentiment) as any} size="small" />
//         </TableCell>
//         <TableCell>
//           <Chip label={request.status || "Pending"} size="small" />
//         </TableCell>
//       </TableRow>
//       <TableRow>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box sx={{ p: 2 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Content
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                 {request.content || "No content."}
//               </Typography>

//               <Typography variant="subtitle2" gutterBottom>
//                 Summary
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                 {request.summary || "No summary."}
//               </Typography>

//               <Typography variant="subtitle2" gutterBottom>
//                 Response
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {request.response || "No response yet."}
//               </Typography>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </React.Fragment>
//   );
// }

// export interface RequestHistoryTableProps {
//   requests?: UserRequestDTO[];
// }

// export function RequestHistoryTable({ requests = [] }: RequestHistoryTableProps): React.JSX.Element {
//   return (
//     <Card>
//       <CardHeader title="Request History" />
//       <Divider />
//       <Box sx={{ overflowX: "auto" }}>
//         <Table sx={{ minWidth: 800 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell />
//               <TableCell>Date</TableCell>
//               <TableCell>Type</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Sentiment</TableCell>
//               <TableCell>Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {requests && requests.length > 0 ? (
//               requests.map((req) => <RequestRow key={req.id} request={req} />)
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
//                     No requests found
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
