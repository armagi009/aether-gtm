import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getMetrics } from '@/lib/api';
import type { Metric } from '../../../worker/types';
const MetricCard = ({ metric }: { metric: Metric }) => (
  <Card className="bg-background border-2 border-foreground rounded-none">
    <CardHeader className="p-4 pb-0">
      <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {metric.label}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4">
      <p className="text-4xl font-bold font-mono">{metric.value}</p>
    </CardContent>
  </Card>
);
const MetricSkeleton = () => (
  <Card className="bg-background border-2 border-foreground rounded-none">
    <CardHeader className="p-4 pb-0">
      <Skeleton className="h-4 w-24" />
    </CardHeader>
    <CardContent className="p-4">
      <Skeleton className="h-10 w-32" />
    </CardContent>
  </Card>
);
export function MetricsDisplay() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      }
    };
    const initialFetch = async () => {
      try {
        setLoading(true);
        await fetchMetrics();
      } finally {
        setLoading(false);
      }
    };
    initialFetch();
    const intervalId = setInterval(fetchMetrics, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <MetricSkeleton key={index} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
}