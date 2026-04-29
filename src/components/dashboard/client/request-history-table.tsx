"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { UserRequestDTO } from "@/types/client-dashboard";

function getSentimentColor(sentiment: string | null) {
  const norm = sentiment?.toLowerCase();
  switch (norm) {
    case "positive":
      return "success";
    case "neutral":
      return "default";
    case "frustrated":
      return "warning";
    case "angry":
      return "error";
    default:
      return "default";
  }
}

interface RequestRowProps {
  request: UserRequestDTO;
}

function RequestRow({ request }: RequestRowProps): React.JSX.Element {
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
          <Typography variant="body2">{dayjs(request.createdAt).format("MMM DD, YYYY, hh:mm A")}</Typography>
        </TableCell>
        <TableCell>{request.type || "N/A"}</TableCell>
        <TableCell>{request.category || "N/A"}</TableCell>
        <TableCell>
          <Chip label={request.sentiment || "Unknown"} color={getSentimentColor(request.sentiment) as any} size="small" />
        </TableCell>
        <TableCell>
          <Chip label={request.status || "Pending"} size="small" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Content
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {request.content || "No content."}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Summary
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {request.summary || "No summary."}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Response
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {request.response || "No response yet."}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export interface RequestHistoryTableProps {
  requests?: UserRequestDTO[];
}

export function RequestHistoryTable({ requests = [] }: RequestHistoryTableProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader title="Request History" />
      <Divider />
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Sentiment</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests && requests.length > 0 ? (
              requests.map((req) => <RequestRow key={req.id} request={req} />)
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No requests found
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
