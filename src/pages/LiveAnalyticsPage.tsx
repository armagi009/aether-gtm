import { useEffect, useState } from 'react';
import { KpiChart } from '@/components/analytics/KpiChart';
import { getAnalyticsData } from '@/lib/api';
import type { AnalyticsDataPoint } from '../../worker/types';
import { Skeleton } from '@/components/ui/skeleton';
const ChartSkeleton = () => (
  <div className="bg-background border-2 border-foreground rounded-none h-[400px] p-4 space-y-4">
    <Skeleton className="h-8 w-1/3" />
    <div className="h-full w-full flex items-center justify-center">
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);
export function LiveAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAnalyticsData();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-mono uppercase tracking-widest">Live Performance Analytics</h1>
        <p className="text-muted-foreground">Real-time mission results and autonomy progression tracking.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <KpiChart
              title="Pipeline vs. CAC"
              data={analyticsData}
              xAxisKey="month"
              dataKeys={[
                { name: 'pipeline', color: '#FFDF00' },
                { name: 'cac', color: '#3b82f6' },
              ]}
            />
            <KpiChart
              title="Customer Lifetime Value (LTV)"
              data={analyticsData}
              xAxisKey="month"
              dataKeys={[
                { name: 'ltv', color: '#22c55e' },
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
}