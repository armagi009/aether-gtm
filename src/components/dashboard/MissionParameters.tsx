import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getMissionParameters } from '@/lib/api';
import type { MissionParameter } from '../../../worker/types';
export function MissionParameters() {
  const [parameters, setParameters] = useState<MissionParameter[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchParameters = async () => {
      try {
        setLoading(true);
        const data = await getMissionParameters();
        setParameters(data);
      } catch (error) {
        console.error("Failed to fetch mission parameters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParameters();
  }, []);
  return (
    <Card className="bg-background border-2 border-foreground rounded-none">
      <CardHeader className="p-4 border-b-2 border-foreground">
        <CardTitle className="text-lg font-bold font-mono uppercase tracking-widest">
          Mission Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-6 w-48" />
            </div>
          ))
        ) : (
          parameters.map((param) => (
            <div key={param.label}>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {param.label}
              </p>
              <p className="text-lg font-medium font-mono text-electric-yellow animate-pulse-subtle">{param.value}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}