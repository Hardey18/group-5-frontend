"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { HorizontalBarChart } from "./horizontal-bar-chart";

interface CategoryBreakdownProps {
  counts: Record<string, number>;
  percentages: Record<string, number>;
}

export function CategoryBreakdown({ counts, percentages }: CategoryBreakdownProps): React.JSX.Element {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Calls By Category" />
      <Divider />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">Volume</Typography>
            <Box sx={{ minHeight: 200 }}>
              <HorizontalBarChart data={counts} defaultColor="primary.main" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">Distribution</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minHeight: 200 }}>
              {Object.keys(percentages).length === 0 ? (
                <Typography color="text.secondary">No data available</Typography>
              ) : (
                Object.entries(percentages).sort((a,b) => b[1]-a[1]).map(([label, pct]) => (
                  <Box key={`pct-${label}`} display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" sx={{ textTransform: "capitalize", width: 80, fontWeight: 500 }} noWrap>
                      {label}
                    </Typography>
                    <Box sx={{ flex: 1, height: 8, bgcolor: "action.hover", borderRadius: 4, overflow: "hidden" }}>
                      <Box sx={{ width: `${pct}%`, height: "100%", bgcolor: "primary.light" }} />
                    </Box>
                    <Typography variant="body2" sx={{ width: 40, textAlign: "right", color: "text.secondary" }}>
                      {pct.toFixed(1)}%
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
