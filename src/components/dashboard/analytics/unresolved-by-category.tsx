"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { HorizontalBarChart } from "./horizontal-bar-chart";

interface UnresolvedByCategoryProps {
  data: Record<string, number>;
}

export function UnresolvedByCategory({ data }: UnresolvedByCategoryProps): React.JSX.Element {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Unresolved Issues by Category" subheader="Active/Pending support requests" />
      <Divider />
      <CardContent>
        <Box sx={{ minHeight: 200 }}>
          <HorizontalBarChart data={data} defaultColor="error.main" />
        </Box>
      </CardContent>
    </Card>
  );
}
