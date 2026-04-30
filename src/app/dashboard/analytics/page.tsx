"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import { useAnalyticsDashboard } from "@/lib/react-query/analytics.queries";
import { KpiCard } from "@/components/dashboard/analytics/kpi-card";
import { DaysSelector } from "@/components/dashboard/analytics/days-selector";
import { DailyVolumeChart } from "@/components/dashboard/analytics/daily-volume-chart";
import { SentimentBreakdown } from "@/components/dashboard/analytics/sentiment-breakdown";
import { CategoryBreakdown } from "@/components/dashboard/analytics/category-breakdown";
import { UnresolvedByCategory } from "@/components/dashboard/analytics/unresolved-by-category";

export default function AnalyticsDashboardPage(): React.JSX.Element {
  // const router = useRouter();
  const [days, setDays] = React.useState<number>(30);

  const { data: response, isLoading, error } = useAnalyticsDashboard(days);

  // React.useEffect(() => {
  //   if (error && ((error as any)?.status === 401 || (error as any)?.status === 403 || (error as any)?.response?.status === 401)) {
  //     router.push("/auth/sign-in");
  //   }
  // }, [error, router]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // if (error || (response && !response.success)) {
  //   return (
  //     <Stack spacing={3}>
  //       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  //         <div>
  //           <Typography variant="h4">Analytics Dashboard</Typography>
  //           <Typography color="text.secondary">Admin & Supervisor View</Typography>
  //         </div>
  //         <DaysSelector days={days} onChange={setDays} />
  //       </Box>
  //       <Alert severity="error">
  //         Failed to load analytics data. {(error as any)?.message || response?.message || "Please check your permissions and try again."}
  //       </Alert>
  //     </Stack>
  //   );
  // }

  const data = response?.data;
  console.log("DATA2", data)
  // if (!data) return <div />;

  return (
    <Stack spacing={4}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <div>
          <Typography variant="h4">Analytics Dashboard</Typography>
          <Typography color="text.secondary" variant="body1">Admin & Supervisor View</Typography>
        </div>
        <DaysSelector days={days} onChange={setDays} />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Total Calls" value={data?.totalCalls} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Active Calls" value={data?.activeCalls} accentColor="info" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Ended Calls" value={data?.endedCalls} accentColor="secondary" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Total Unique Clients" value={data?.totalUniqueClients} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Issues Resolved" value={data?.issuesResolved} accentColor="success" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Issues Pending" value={data?.issuesPending} accentColor="error" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard 
            title="Resolution Rate" 
            value={`${data?.resolutionRate?.toFixed(1) || 0}%`}
            subtitle={
              <Box sx={{ height: 4, width: '100%', bgcolor: 'action.hover', mt: 1, borderRadius: 1, overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: `${data?.resolutionRate || 0}%`, bgcolor: 'success.main' }} />
              </Box>
            }
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard 
            title="Avg Satisfaction" 
            value={data?.averageSatisfactionRating ? `${data?.averageSatisfactionRating.toFixed(1)}★` : "N/A"} 
          />
        </Grid>
      </Grid>

      <Box sx={{ maxWidth: 300 }}>
        <KpiCard 
          title="Avg Call Duration" 
          value={data?.averageCallDurationMinutes ? `${data?.averageCallDurationMinutes.toFixed(1)} min` : "N/A"} 
        />
      </Box>

      <DailyVolumeChart data={data?.dailyCallVolume || {}} />

      <SentimentBreakdown counts={data?.callsBySentiment || {}} percentages={data?.sentimentPercentages || {}} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <CategoryBreakdown counts={data?.callsByCategory || {}} percentages={data?.categoryPercentages || {}} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <UnresolvedByCategory data={data?.unresolvedByCategory || {}} />
        </Grid>
      </Grid>
    </Stack>
  );
}
