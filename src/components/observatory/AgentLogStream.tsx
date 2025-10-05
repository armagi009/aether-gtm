import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAgentLogs } from '@/lib/api';
import type { AgentLog, AgentName, LogType } from '../../../worker/types';
import { cn } from '@/lib/utils';
const AGENT_NAMES: AgentName[] = ['ORCHESTRATOR', 'SDO AGENT', 'ENGAGEMENT AGENT', 'DEAL DESK AGENT', 'FINOPS AGENT', 'EXPANSION AGENT'];
const LOG_TYPES: LogType[] = ['REASONING', 'OBSERVATION', 'ACTION'];
export function AgentLogStream() {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<AgentName | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<LogType | 'ALL'>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetchLogs = async () => {
    try {
      const data = await getAgentLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch agent logs:", error);
    }
  };
  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      await fetchLogs();
      setLoading(false);
    };
    initialFetch();
    const interval = setInterval(fetchLogs, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);
  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => selectedAgent === 'ALL' || log.agent === selectedAgent)
      .filter(log => selectedType === 'ALL' || log.type === selectedType);
  }, [logs, selectedAgent, selectedType]);
  return (
    <Card className="bg-black border-2 border-foreground rounded-none h-full flex flex-col">
      <CardHeader className="p-4 border-b-2 border-foreground flex-row justify-between items-center">
        <CardTitle className="text-lg font-bold font-mono uppercase tracking-widest">
          Agent Log Stream
        </CardTitle>
        <div className="flex space-x-2">
          <Select value={selectedAgent} onValueChange={(value) => setSelectedAgent(value as AgentName | 'ALL')}>
            <SelectTrigger className="w-[200px] bg-background border-2 border-foreground rounded-none font-mono">
              <SelectValue placeholder="Filter by Agent" />
            </SelectTrigger>
            <SelectContent className="bg-background border-2 border-foreground rounded-none font-mono">
              <SelectItem value="ALL">ALL AGENTS</SelectItem>
              {AGENT_NAMES.map(agent => <SelectItem key={agent} value={agent}>{agent}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as LogType | 'ALL')}>
            <SelectTrigger className="w-[200px] bg-background border-2 border-foreground rounded-none font-mono">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent className="bg-background border-2 border-foreground rounded-none font-mono">
              <SelectItem value="ALL">ALL LOG TYPES</SelectItem>
              {LOG_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent ref={scrollRef} className="p-4 flex-grow overflow-y-auto font-mono text-sm">
        {loading ? (
          <div className="text-muted-foreground">Loading log stream...</div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start">
                <span className="text-muted-foreground w-32 shrink-0">{log.timestamp}</span>
                <span className={cn('font-bold w-24 shrink-0', log.type === 'REASONING' ? 'text-purple-400' : 'text-blue-400')}>
                  [{log.type}]
                </span>
                <span className="font-bold text-green-400 w-40 shrink-0">
                  [{log.agent}]
                </span>
                <span className="flex-1 text-foreground whitespace-pre-wrap">
                  {log.content}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}