import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { MetricsDisplay } from '@/components/dashboard/MetricsDisplay';
import { MissionParameters } from '@/components/dashboard/MissionParameters';
import { EscalationCard } from '@/components/dashboard/EscalationCard';
import { EventFeed } from '@/components/dashboard/EventFeed';
import { getEscalations, handleEscalationAction } from '@/lib/api';
import type { Escalation } from '../../worker/types';
export function MissionControlDashboard() {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loadingEscalations, setLoadingEscalations] = useState(true);
  const fetchEscalations = async () => {
    try {
      const data = await getEscalations();
      setEscalations(data);
    } catch (error) {
      console.error("Failed to fetch escalations:", error);
    }
  };
  useEffect(() => {
    const initialFetch = async () => {
      setLoadingEscalations(true);
      await fetchEscalations();
      setLoadingEscalations(false);
    };
    initialFetch();
    const intervalId = setInterval(fetchEscalations, 5000);
    return () => clearInterval(intervalId);
  }, []);
  const onAction = async (id: string, action: 'approve' | 'deny') => {
    const originalEscalations = [...escalations];
    // Optimistically remove the card from the UI
    setEscalations(prev => prev.filter(e => e.id !== id));
    try {
      await handleEscalationAction(id, action);
      toast.success(`Escalation ${id} has been ${action}d.`);
    } catch (error) {
      console.error(`Failed to ${action} escalation ${id}:`, error);
      toast.error(`Failed to ${action} escalation. Please try again.`);
      // Revert on error
      setEscalations(originalEscalations);
    }
  };
  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-mono uppercase tracking-widest">Mission Control</h1>
        <p className="text-muted-foreground">Strategic oversight for autonomous GTM execution.</p>
      </header>
      <MetricsDisplay />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold font-mono uppercase tracking-widest mb-4">
              Pending Escalations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[200px]">
              <AnimatePresence>
                {loadingEscalations ? (
                  <p className="text-muted-foreground col-span-full">Loading escalations...</p>
                ) : escalations.length > 0 ? (
                  escalations.map((escalation) => (
                    <motion.div
                      key={escalation.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <EscalationCard
                        escalation={escalation}
                        onApprove={() => onAction(escalation.id, 'approve')}
                        onDeny={() => onAction(escalation.id, 'deny')}
                      />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full">No pending escalations.</p>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
        <div className="lg:col-span-1">
          <MissionParameters />
        </div>
      </div>
      <div className="h-[500px]">
        <EventFeed />
      </div>
    </div>
  );
}