export type MessageType = "SMS" | "Email" | "WhatsApp";

export interface GenerateFollowUpDTO {
  callId: string;
  type: MessageType;
}

export interface FollowUpMessageDTO {
  id: string;
  callId: string;
  type: string | null;
  content: string | null;
  isApproved: boolean;
  sentAt: string | null;
  deliveryStatus: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}
