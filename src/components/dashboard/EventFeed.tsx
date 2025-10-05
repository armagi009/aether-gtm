import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEvents } from '@/lib/api';
import type { Event } from '../../../worker/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
const getStatusColor = (status: Event['status']) => {
  switch (status) {
    case 'OK':
      return 'text-green-400';
    case 'WARN':
      return 'text-electric-yellow';
    case 'FAIL':
      return 'text-red-500';
    case 'INFO':
    default:
      return 'text-blue-400';
  }
};
export function EventFeed() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        // Only update state if the data has actually changed to prevent re-renders
        setEvents(currentEvents => {
          if (JSON.stringify(currentEvents) !== JSON.stringify(data)) {
            return data;
          }
          return currentEvents;
        });
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    const initialFetch = async () => {
      try {
        setLoading(true);
        await fetchEvents();
      } finally {
        setLoading(false);
      }
    };
    initialFetch();
    const intervalId = setInterval(fetchEvents, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  return (
    <Card className="bg-black border-2 border-foreground rounded-none h-full flex flex-col">
      <CardHeader className="p-4 border-b-2 border-foreground">
        <CardTitle className="text-lg font-bold font-mono uppercase tracking-widest">
          Live Event Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow overflow-y-auto font-mono text-sm">
        {loading ? (
          <div className="text-muted-foreground">Loading event feed...</div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex"
                >
                  <span className="text-muted-foreground mr-4">{event.timestamp}</span>
                  <span className={cn('font-bold w-32 mr-4', getStatusColor(event.status))}>
                    [{event.agent}]
                  </span>
                  <span className="flex-1 text-foreground">{event.action}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}