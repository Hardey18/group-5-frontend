"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface HorizontalBarChartProps {
  data: Record<string, number>;
  colorMap?: Record<string, string>; 
  defaultColor?: string;
}

export function HorizontalBarChart({ data, colorMap = {}, defaultColor = "primary.main" }: HorizontalBarChartProps): React.JSX.Element {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(...entries.map(e => e[1]), 1);

  if (entries.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
      {entries.map(([label, val]) => {
        const widthPct = (val / maxVal) * 100;
        const color = colorMap[label.toLowerCase()] || defaultColor;

        return (
          <Box key={label}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" sx={{ textTransform: "capitalize", fontWeight: 500 }}>
                {label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {val}
              </Typography>
            </Box>
            <Box sx={{ height: 8, bgcolor: "action.hover", borderRadius: 4, overflow: "hidden" }}>
              <Box
                sx={{
                  height: "100%",
                  width: `${widthPct}%`,
                  bgcolor: color,
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
