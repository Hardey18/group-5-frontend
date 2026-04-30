"use client";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { MessageType } from "@/types/followup";
import { ChatText as SMSIcon } from "@phosphor-icons/react/dist/ssr/ChatText";
import { Envelope as EmailIcon } from "@phosphor-icons/react/dist/ssr/Envelope";
import { ChatCircle as WhatsAppIcon } from "@phosphor-icons/react/dist/ssr/ChatCircle";

export function MessageTypeToggle({ value, onChange }: { 
  value: MessageType; 
  onChange: (val: MessageType) => void;
}) {
  return (
    <ToggleButtonGroup
      color="primary"
      value={value}
      exclusive
      onChange={(e, val) => {
        if (val !== null) onChange(val);
      }}
      fullWidth
    >
      <ToggleButton value="SMS">
        <SMSIcon size={20} style={{ marginRight: 8 }} /> SMS
      </ToggleButton>
      <ToggleButton value="Email">
        <EmailIcon size={20} style={{ marginRight: 8 }} /> Email
      </ToggleButton>
      <ToggleButton value="WhatsApp">
        <WhatsAppIcon size={20} style={{ marginRight: 8 }} /> WhatsApp
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
