import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { AgentConfig } from '../../../worker/types';
interface AgentConfigCardProps {
  config: AgentConfig;
  onSave: (config: AgentConfig) => Promise<void>;
}
export function AgentConfigCard({ config: initialConfig, onSave }: AgentConfigCardProps) {
  const [config, setConfig] = useState<AgentConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(config);
    } catch (error) {
      console.error(`Failed to save config for ${config.name}`, error);
      // Optionally reset to initial config on error
      setConfig(initialConfig);
    } finally {
      setIsSaving(false);
    }
  };
  const isChanged = JSON.stringify(config) !== JSON.stringify(initialConfig);
  return (
    <Card className="bg-background border-2 border-foreground rounded-none flex flex-col">
      <CardHeader className="p-4 flex flex-row items-start space-x-4 border-b-2 border-foreground">
        <div className="bg-foreground text-background p-2">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold font-mono uppercase tracking-wider text-foreground">
            {config.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Operational Parameters
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6 flex-grow">
        <div className="flex items-center justify-between">
          <Label htmlFor={`enabled-${config.id}`} className="font-bold uppercase tracking-wider">
            Agent Enabled
          </Label>
          <Switch
            id={`enabled-${config.id}`}
            checked={config.enabled}
            onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
            className="data-[state=checked]:bg-electric-yellow data-[state=unchecked]:bg-gray-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`api-quota-${config.id}`} className="font-bold uppercase tracking-wider text-sm">
            API Quota / Day
          </Label>
          <Input
            id={`api-quota-${config.id}`}
            type="number"
            value={config.apiQuotaPerDay}
            onChange={(e) => setConfig({ ...config, apiQuotaPerDay: parseInt(e.target.value, 10) || 0 })}
            className="bg-black border-2 border-foreground rounded-none font-mono text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`risk-threshold-${config.id}`} className="font-bold uppercase tracking-wider text-sm">
            Risk Threshold
          </Label>
          <Input
            id={`risk-threshold-${config.id}`}
            type="text"
            value={config.riskThreshold}
            onChange={(e) => setConfig({ ...config, riskThreshold: e.target.value })}
            className="bg-black border-2 border-foreground rounded-none font-mono text-lg"
          />
        </div>
      </CardContent>
      <div className="p-4 border-t-2 border-foreground">
        <Button
          onClick={handleSave}
          disabled={!isChanged || isSaving}
          className="w-full bg-electric-yellow text-background font-bold uppercase tracking-widest rounded-none hover:bg-foreground hover:text-background border-2 border-foreground disabled:bg-gray-800 disabled:text-muted-foreground disabled:border-muted-foreground"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Card>
  );
}