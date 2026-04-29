"use client";

import * as React from "react";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface DaysSelectorProps {
  days: number;
  onChange: (days: number) => void;
}

const OPTIONS = [7, 14, 30, 90, 180, 365];

export function DaysSelector({ days, onChange }: DaysSelectorProps): React.JSX.Element {
  const handleChange = (e: SelectChangeEvent<number>) => {
    onChange(Number(e.target.value));
  };

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select
        value={days}
        onChange={handleChange as any}
        displayEmpty
      >
        {OPTIONS.map((val) => (
          <MenuItem key={val} value={val}>
            Last {val} days
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
