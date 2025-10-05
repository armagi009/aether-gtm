export interface Metric {
  label: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
}
export interface MissionParameter {
  label: string;
  value: string;
}
export interface Escalation {
  id: string;
  agent: string;
  reason: string;
  details: string;
  timestamp: string;
}
export type EventStatus = 'OK' | 'WARN' | 'FAIL' | 'INFO';
export interface Event {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  status: EventStatus;
}
export type AgentName =
  | 'ORCHESTRATOR'
  | 'SDO AGENT'
  | 'ENGAGEMENT AGENT'
  | 'DEAL DESK AGENT'
  | 'FINOPS AGENT'
  | 'EXPANSION AGENT';
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
export type LogType = 'REASONING' | 'OBSERVATION' | 'ACTION';
export interface AgentLog {
  id: string;
  timestamp: string;
  agent: AgentName;
  type: LogType;
  content: string;
}
export interface AgentConfig {
  id: string;
  name: AgentName;
  enabled: boolean;
  apiQuotaPerDay: number;
  riskThreshold: string;
}
export interface AnalyticsDataPoint {
  month: string;
  pipeline: number;
  cac: number;
  ltv: number;
}
export interface GtmSystemState {
  metrics: Metric[];
  missionParameters: MissionParameter[];
  escalations: Escalation[];
  events: Event[];
  agentLogs: AgentLog[];
  agentConfigs: AgentConfig[];
  analyticsData: AnalyticsDataPoint[];
}