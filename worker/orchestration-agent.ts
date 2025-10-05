import { DurableObject } from 'cloudflare:workers';
import type { Env } from './core-utils';
import type { GtmSystemState, AgentConfig, AnalyticsDataPoint, AgentName } from './types';
const initialAnalyticsData: AnalyticsDataPoint[] = [
  { month: 'Jan', pipeline: 120000, cac: 18000, ltv: 90000 },
  { month: 'Feb', pipeline: 150000, cac: 17500, ltv: 92000 },
  { month: 'Mar', pipeline: 220000, cac: 16000, ltv: 110000 },
  { month: 'Apr', pipeline: 200000, cac: 15500, ltv: 115000 },
  { month: 'May', pipeline: 280000, cac: 14000, ltv: 130000 },
  { month: 'Jun', pipeline: 350000, cac: 13500, ltv: 150000 },
  { month: 'Jul', pipeline: 450000, cac: 12831, ltv: 165000 },
];
const initialMockState: GtmSystemState = {
  metrics: [
    { label: 'BUDGET', value: '$200,000' },
    { label: 'SPEND', value: '$76,591' },
    { label: 'CAC TARGET', value: '$15,000' },
    { label: 'CURRENT CAC', value: '$12,831' },
    { label: 'PIPELINE', value: '$450,000' },
    { label: 'CLOSED WON', value: '6' },
  ],
  missionParameters: [
    { label: 'MISSION GOAL', value: 'Acquire 10 enterprise SaaS customers in Q4' },
    { label: 'TOTAL BUDGET', value: '$200,000' },
    { label: 'RISK TOLERANCE', value: 'MEDIUM' },
    { label: 'BRAND VOICE', value: 'Professional, Innovative' },
  ],
  escalations: [
    {
      id: 'ESC-001',
      agent: 'DEAL DESK AGENT',
      reason: 'DISCOUNT > 20%',
      details: 'Prospect "Innovate Inc." requests a 25% discount on a $150k annual contract. Standard policy allows for 20%.',
      timestamp: '2m ago',
    },
  ],
  events: [
    { id: 'EVT-3456', timestamp: '10:45:12Z', agent: 'ORCHESTRATOR', action: 'Mission Start: Q4 Enterprise Acquisition', status: 'OK' },
    { id: 'EVT-3457', timestamp: '10:45:13Z', agent: 'FINOPS AGENT', action: 'Budget of $200,000 allocated.', status: 'INFO' },
  ],
  agentLogs: [
    { id: 'LOG-001', timestamp: '10:46:20Z', agent: 'SDO AGENT', type: 'REASONING', content: 'Mission goal requires enterprise SaaS leads. Querying Crunchbase for companies with >$20M funding in the SaaS sector.' },
    { id: 'LOG-002', timestamp: '10:48:55Z', agent: 'SDO AGENT', type: 'OBSERVATION', content: 'API returned 250 companies. Filtering to match ICP criteria (US-based, >100 employees).' },
  ],
  agentConfigs: [
    { id: 'sdo-agent', name: 'SDO AGENT', enabled: true, apiQuotaPerDay: 500, riskThreshold: 'LOW' },
    { id: 'engagement-agent', name: 'ENGAGEMENT AGENT', enabled: true, apiQuotaPerDay: 2000, riskThreshold: 'LOW' },
    { id: 'deal-desk-agent', name: 'DEAL DESK AGENT', enabled: true, apiQuotaPerDay: 100, riskThreshold: 'MEDIUM' },
    { id: 'finops-agent', name: 'FINOPS AGENT', enabled: true, apiQuotaPerDay: 1000, riskThreshold: 'HIGH' },
    { id: 'expansion-agent', name: 'EXPANSION AGENT', enabled: false, apiQuotaPerDay: 500, riskThreshold: 'MEDIUM' },
  ],
  analyticsData: initialAnalyticsData,
};
export class OrchestrationAgent extends DurableObject<Env> {
  private state: GtmSystemState;
  private interval: number | null = null;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.state = initialMockState;
    this.ctx.blockConcurrencyWhile(async () => {
      const storedState = await this.ctx.storage.get<GtmSystemState>('state');
      if (storedState) {
        this.state = storedState;
      } else {
        await this.ctx.storage.put('state', this.state);
      }
    });
  }
  async fetch(request: Request): Promise<Response> {
    if (!this.interval) {
      // Use a number for the interval ID
      this.interval = setInterval(() => this.simulate(), 10000) as any as number;
    }
    const url = new URL(request.url);
    const path = url.pathname.split('/');
    const endpoint = path[1];
    const id = path[2];
    if (request.method === 'GET') {
      switch (endpoint) {
        case 'status': return this.createJsonResponse(this.state);
        case 'metrics': return this.createJsonResponse(this.state.metrics);
        case 'parameters': return this.createJsonResponse(this.state.missionParameters);
        case 'events': return this.createJsonResponse([...this.state.events].reverse());
        case 'escalations': return this.createJsonResponse(this.state.escalations);
        case 'logs': return this.createJsonResponse(this.state.agentLogs);
        case 'configs': return this.createJsonResponse(this.state.agentConfigs);
        case 'analytics': return this.createJsonResponse(this.state.analyticsData);
      }
    }
    if (request.method === 'POST') {
      if (endpoint === 'escalations' && id) {
        const { action } = await request.json<{ action: 'approve' | 'deny' }>();
        return this.handleEscalation(id, action);
      }
      if (endpoint === 'configs') {
        const config = await request.json<AgentConfig>();
        return this.updateConfig(config);
      }
    }
    return new Response('Not Found', { status: 404 });
  }
  async handleEscalation(id: string, action: 'approve' | 'deny'): Promise<Response> {
    const escalationIndex = this.state.escalations.findIndex(e => e.id === id);
    if (escalationIndex === -1) {
      return new Response('Escalation not found', { status: 404 });
    }
    const escalation = this.state.escalations[escalationIndex];
    this.state.escalations.splice(escalationIndex, 1);
    const eventAction = action === 'approve' ? `Approved escalation ${id}: ${escalation.reason}` : `Denied escalation ${id}: ${escalation.reason}`;
    this.addEvent('ORCHESTRATOR', eventAction, 'OK');
    await this.ctx.storage.put('state', this.state);
    return this.createJsonResponse({ message: `Escalation ${id} ${action}d.` });
  }
  async updateConfig(config: AgentConfig): Promise<Response> {
    const configIndex = this.state.agentConfigs.findIndex(c => c.id === config.id);
    if (configIndex === -1) {
      return new Response('Config not found', { status: 404 });
    }
    this.state.agentConfigs[configIndex] = config;
    this.addEvent('ORCHESTRATOR', `Updated config for ${config.name}`, 'INFO');
    await this.ctx.storage.put('state', this.state);
    return this.createJsonResponse(config);
  }
  simulate() {
    // 1. Update a metric
    const spendMetric = this.state.metrics.find(m => m.label === 'SPEND');
    if (spendMetric) {
      const currentSpend = parseInt(spendMetric.value.replace(/[$,]/g, ''));
      const newSpend = currentSpend + Math.floor(Math.random() * 500) + 100;
      spendMetric.value = `$${newSpend.toLocaleString()}`;
    }
    // 2. Add a new event
    const randomAgent = this.state.agentConfigs[Math.floor(Math.random() * this.state.agentConfigs.length)].name;
    const actions = ['Analyzed prospect data', 'Optimized outreach sequence', 'Calculated pipeline velocity', 'Monitored customer health score'];
    this.addEvent(randomAgent, actions[Math.floor(Math.random() * actions.length)], 'INFO');
    // 3. Add a new log
    this.state.agentLogs.push({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().substr(11, 12) + 'Z',
      agent: randomAgent,
      type: 'OBSERVATION',
      content: 'System health nominal. Continuing operations.'
    });
    if (this.state.agentLogs.length > 50) this.state.agentLogs.shift();
    // 4. Occasionally add a new escalation (10% chance)
    if (Math.random() < 0.1 && this.state.escalations.length < 3) {
      this.state.escalations.push({
        id: `ESC-${Date.now()}`,
        agent: 'FINOPS AGENT',
        reason: 'UNUSUAL SPEND DETECTED',
        details: 'Marketing spend on Campaign "X" increased by 30% in the last hour. Requesting review.',
        timestamp: '1s ago'
      });
    }
    this.ctx.storage.put('state', this.state);
  }
  addEvent(agent: string, action: string, status: 'OK' | 'WARN' | 'FAIL' | 'INFO') {
    this.state.events.push({
      id: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString().substr(11, 8) + 'Z',
      agent,
      action,
      status,
    });
    if (this.state.events.length > 50) this.state.events.shift();
  }
  private createJsonResponse(data: any): Response {
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}