// Re-exporting ApiResponse if it exists globally, or defining it here.
// In the previous task, we defined it in client-dashboard.ts. To follow the pattern, we'll define it here for isolation if no global type exists.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface AnalyticsDashboardDTO {
  totalCalls: number;
  activeCalls: number;
  endedCalls: number;
  totalUniqueClients: number;
  issuesResolved: number;
  issuesPending: number;
  resolutionRate: number;
  averageSatisfactionRating: number | null;
  averageCallDurationMinutes: number | null;
  callsByCategory: Record<string, number>;
  categoryPercentages: Record<string, number>;
  callsBySentiment: Record<string, number>;
  sentimentPercentages: Record<string, number>;
  dailyCallVolume: Record<string, number>;
  unresolvedByCategory: Record<string, number>;
}
