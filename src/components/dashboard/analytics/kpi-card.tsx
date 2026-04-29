"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: React.ReactNode;
  accentColor?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

export function KpiCard({ title, value, subtitle, accentColor }: KpiCardProps): React.JSX.Element {
  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      {accentColor && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: `var(--mui-palette-${accentColor}-main)`,
          }}
        />
      )}
      <CardContent>
        <Typography variant="overline" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" component="div">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
