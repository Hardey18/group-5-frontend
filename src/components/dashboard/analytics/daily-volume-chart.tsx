"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import dayjs from "dayjs";

interface DailyVolumeChartProps {
  data: Record<string, number>;
}

export function DailyVolumeChart({ data }: DailyVolumeChartProps): React.JSX.Element {
  const dates = Object.keys(data).sort();
  const maxVal = Math.max(...Object.values(data), 1); 

  const showLabelInterval = dates.length > 0 ? Math.ceil(dates.length / 7) : 1; 

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Daily Call Volume" />
      <Divider />
      <Box sx={{ p: 3, height: 300, display: "flex", flexDirection: "column" }}>
        {dates.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
            <Typography color="text.secondary">No data available</Typography>
          </Box>
        ) : (
          <Box display="flex" flex={1} alignItems="flex-end" gap={0.5}>
            {dates.map((date, index) => {
              const val = data[date];
              const heightPct = (val / maxVal) * 100;
              const showLabel = index % showLabelInterval === 0 || index === dates.length - 1;

              return (
                <Box key={date} sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                  <Box sx={{ flex: 1, display: "flex", alignItems: "flex-end", position: "relative" }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: `${heightPct}%`,
                        bgcolor: "var(--mui-palette-primary-main)",
                        borderRadius: "4px 4px 0 0",
                        transition: "height 0.3s ease",
                        minHeight: heightPct > 0 ? "4px" : "0",
                        "&:hover": { opacity: 0.8 }
                      }}
                      title={`${date}: ${val} calls`}
                    />
                  </Box>
                  <Box sx={{ height: 24, mt: 1, textAlign: "center", overflow: "hidden" }}>
                    {showLabel && (
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {dayjs(date).format("MMM D")}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Card>
  );
}
