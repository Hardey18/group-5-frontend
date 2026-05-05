"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { CallDTO } from "@/types/client-dashboard";

interface CallRowProps {
  call: CallDTO;
}

function CallRow({ call }: CallRowProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <CaretUp /> : <CaretDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{dayjs(call.startTime).format("MMM DD, YYYY, hh:mm A")}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {call.endTime ? dayjs(call.endTime).format("MMM DD, YYYY, hh:mm A") : "Ongoing"}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            label={call.status}
            color={call.status.toLowerCase() === "active" ? "primary" : "default"}
            size="small"
          />
        </TableCell>
        <TableCell>
          <Chip label={call.isResolved ? "Yes" : "No"} color={call.isResolved ? "success" : "error"} size="small" />
        </TableCell>
        <TableCell>
          {call.satisfactionRating ? <Rating value={call.satisfactionRating} readOnly size="small" /> : <Typography variant="body2">N/A</Typography>}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Transcript
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto', mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                  {call.transcript || "No transcript available."}
                </Typography>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Follow-up Messages
              </Typography>
              {call.followUpMessages && call.followUpMessages.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Content</TableCell>
                      <TableCell>Sent At</TableCell>
                      <TableCell>Delivery Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {call.followUpMessages.map((msg) => (
                      <TableRow key={msg.id}>
                        <TableCell>{msg.type}</TableCell>
                        <TableCell sx={{ maxWidth: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {msg.content}
                        </TableCell>
                        <TableCell>{msg.sentAt ? dayjs(msg.sentAt).format("MMM DD HH:mm") : "N/A"}</TableCell>
                        <TableCell>
                          <Chip label={msg.deliveryStatus || "Pending"} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No follow-up messages.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export interface CallHistoryTableProps {
  calls?: CallDTO[];
}

export function CallHistoryTable({ calls = [] }: CallHistoryTableProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader title="Call History" />
      <Divider />
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Resolved</TableCell>
              <TableCell>Satisfaction</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calls && calls.length > 0 ? (
              calls.map((call) => <CallRow key={call.id} call={call} />)
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No calls found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
