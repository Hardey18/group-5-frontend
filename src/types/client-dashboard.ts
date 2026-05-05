export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ClientDashboardDTO {
  callHistory: CallDTO[];
  requestHistory: UserRequestDTO[];
}

export interface CallDTO {
  id: string;
  clientId: string;
  startTime: string;
  endTime: string | null;
  status: string;
  transcript: string | null;
  satisfactionRating: number | null;
  isResolved: boolean;
  transcriptSegments: TranscriptSegmentDTO[];
  followUpMessages: FollowUpMessageDTO[];
}

export interface TranscriptSegmentDTO {
  callId: string;
  timestamp: string;
  text: string | null;
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

export interface UserRequestDTO {
  id: string;
  userId: string;
  callId: string | null;
  type: string | null;
  content: string | null;
  createdAt: string;
  status: string | null;
  summary: string | null;
  response: string | null;
  category: string | null;
  sentiment: string | null;
}
