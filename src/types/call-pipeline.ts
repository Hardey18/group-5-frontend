export interface CallDTO {
  id: string; // guid — save this as `callId` for all subsequent requests
  clientId: string;
  startTime: string;
  endTime: string | null;
  status: string;
  transcript: string | null;
  satisfactionRating: number | null;
  isResolved: boolean;
  transcriptSegments: any[]; // Using any for segments per requirement scope
  followUpMessages: any[]; 
}

export interface AudioChunkIngestionRequest {
  callId: string;
  sequence: number;
  chunkBase64: string | null;
  audioUrl: string | null;
  sentAtUtc: string;
}

export interface AudioChunkIngestionResponse {
  accepted: boolean;
  callId: string;
  sequence: number;
  correlationId: string;
}

export interface ComplaintAnalysisResult {
  transcribed_text: string;
  summary: string;
  category: string;
  sentiment: string;
  response: string;
  english_response: string;
}

export interface ComplaintPipelineResponse {
  transcribedText: string;
  analysis: ComplaintAnalysisResult;
  audioResponseBase64: string;
  englishAudioResponseBase64: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}
