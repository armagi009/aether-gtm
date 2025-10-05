import type { Metric, MissionParameter, Escalation, Event, AgentLog, AgentConfig, AnalyticsDataPoint } from '../../worker/types';
const API_BASE_URL = '/api/v1/gtm_system';
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: ApiResponse<T> = await response.json();
    if (result.success && result.data !== undefined) {
      return result.data;
    }
    // Handle success: false or missing data
    throw new Error(result.error || 'API request failed');
  } catch (error) {
    console.error(`Failed to fetch from ${endpoint}:`, error);
    throw error;
  }
}
export const getMetrics = (): Promise<Metric[]> => {
  return fetchFromApi<Metric[]>('/metrics');
};
export const getMissionParameters = (): Promise<MissionParameter[]> => {
  return fetchFromApi<MissionParameter[]>('/parameters');
};
export const getEscalations = (): Promise<Escalation[]> => {
  return fetchFromApi<Escalation[]>('/escalations');
};
export const getEvents = (): Promise<Event[]> => {
  return fetchFromApi<Event[]>('/events');
};
export const getAgentLogs = (): Promise<AgentLog[]> => {
  return fetchFromApi<AgentLog[]>('/logs');
};
export const handleEscalationAction = (escalationId: string, action: 'approve' | 'deny'): Promise<{ message: string }> => {
  return fetchFromApi<{ message: string }>(`/escalations/${escalationId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
};
export const getAgentConfigs = (): Promise<AgentConfig[]> => {
  return fetchFromApi<AgentConfig[]>('/configs');
};
export const updateAgentConfig = (config: AgentConfig): Promise<AgentConfig> => {
  return fetchFromApi<AgentConfig>('/configs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
};
export const getAnalyticsData = (): Promise<AnalyticsDataPoint[]> => {
  return fetchFromApi<AnalyticsDataPoint[]>('/analytics');
};