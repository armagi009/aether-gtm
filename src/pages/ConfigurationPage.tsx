import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AgentConfigCard } from '@/components/configuration/AgentConfigCard';
import { getAgentConfigs, updateAgentConfig } from '@/lib/api';
import { AgentConfig } from '../../worker/types';
import { Skeleton } from '@/components/ui/skeleton';
const ConfigSkeleton = () => (
  <div className="bg-background border-2 border-foreground rounded-none p-4 space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="pt-4 space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);
export function ConfigurationPage() {
  const [configs, setConfigs] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true);
        const data = await getAgentConfigs();
        setConfigs(data);
      } catch (error) {
        console.error("Failed to fetch agent configurations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);
  const handleSaveConfig = async (updatedConfig: AgentConfig) => {
    try {
      await updateAgentConfig(updatedConfig);
      setConfigs(configs.map(c => c.id === updatedConfig.id ? updatedConfig : c));
      toast.success(`Configuration for ${updatedConfig.name} saved successfully.`);
    } catch (error) {
      console.error(`Failed to update config for ${updatedConfig.name}:`, error);
      toast.error(`Failed to save configuration for ${updatedConfig.name}.`);
      throw error; // Re-throw to allow the card to handle its state
    }
  };
  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-mono uppercase tracking-widest">Agent Configuration Console</h1>
        <p className="text-muted-foreground">Tune agent behaviors and update policy engine rules.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => <ConfigSkeleton key={index} />)
        ) : (
          configs.map(config => (
            <AgentConfigCard key={config.id} config={config} onSave={handleSaveConfig} />
          ))
        )}
      </div>
    </div>
  );
}