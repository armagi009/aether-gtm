import { OrchestrationAgent } from './orchestration-agent';
export interface Env {
  ORCHESTRATION_AGENT?: DurableObjectNamespace<OrchestrationAgent>;
}
/**
 * Get OrchestrationAgent stub for GTM system state management.
 * Uses a singleton pattern with a fixed ID for consistent routing.
 */
export function getOrchestrationAgent(env: Env): DurableObjectStub<OrchestrationAgent> {
  // If running in the Cloudflare Workers runtime, the DurableObject namespace
  // will be present on env. In local dev (vite runner) it may be undefined,
  // so provide a lightweight in-memory fallback that exposes a `fetch` method.
  if (env.ORCHESTRATION_AGENT) {
    const id = env.ORCHESTRATION_AGENT.idFromName("singleton");
    return env.ORCHESTRATION_AGENT.get(id);
  }

  // Dev fallback: create a single in-memory stub that implements the
  // same HTTP endpoints as the OrchestrationAgent Durable Object. This
  // avoids constructing Cloudflare-specific classes in the Vite dev runner.
  const globalKey = '__DEV_ORCHESTRATION_AGENT__';
  if (!(globalThis as any)[globalKey]) {
    // initial mock state copied from orchestration-agent.ts
    const initialAnalyticsData = [
      { month: 'Jan', pipeline: 120000, cac: 18000, ltv: 90000 },
      { month: 'Feb', pipeline: 150000, cac: 17500, ltv: 92000 },
      { month: 'Mar', pipeline: 220000, cac: 16000, ltv: 110000 },
      { month: 'Apr', pipeline: 200000, cac: 15500, ltv: 115000 },
      { month: 'May', pipeline: 280000, cac: 14000, ltv: 130000 },
      { month: 'Jun', pipeline: 350000, cac: 13500, ltv: 150000 },
      { month: 'Jul', pipeline: 450000, cac: 12831, ltv: 165000 },
    ];
    const state: any = {
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

    const createJsonResponse = (data: any) =>
      new Response(JSON.stringify({ success: true, data }), { headers: { 'Content-Type': 'application/json' } });

    const stub = {
      fetch: async (request: Request) => {
        try {
          const url = new URL(request.url);
          const path = url.pathname.split('/').filter(Boolean); // ['api','v1','gtm_system','metrics']
          // Find relevant segment after /api/v1/gtm_system OR accept top-level forwarded paths like '/metrics'
          const idx = path.indexOf('gtm_system');
          const endpoint = idx >= 0 && path.length > idx + 1 ? path[idx + 1] : (path[0] || '');

          if (request.method === 'GET') {
            switch (endpoint) {
              case 'status': return createJsonResponse(state);
              case 'metrics': return createJsonResponse(state.metrics);
              case 'parameters': return createJsonResponse(state.missionParameters);
              case 'events': return createJsonResponse([...state.events].reverse());
              case 'escalations': return createJsonResponse(state.escalations);
              case 'logs': return createJsonResponse(state.agentLogs);
              case 'configs': return createJsonResponse(state.agentConfigs);
              case 'analytics': return createJsonResponse(state.analyticsData);
            }
          }

          if (request.method === 'POST') {
            if (endpoint === 'escalations') {
              // expecting /escalations/:id with action in body
              const parts = url.pathname.split('/');
              const id = parts[parts.length - 1];
              const body = await request.json().catch(() => ({})) as any;
              if (id && body && body.action) {
                const idx = state.escalations.findIndex((e: any) => e.id === id);
                if (idx === -1) return new Response('Escalation not found', { status: 404 });
                const escalation = state.escalations[idx];
                state.escalations.splice(idx, 1);
                const message = `Escalation ${id} ${body.action}d.`;
                return createJsonResponse({ message });
              }
              return createJsonResponse({ message: 'Escalation posted' });
            }
            if (endpoint === 'configs') {
              const config = await request.json().catch(() => null) as any;
              if (!config || !config.id) return new Response('Invalid config', { status: 400 });
              const index = state.agentConfigs.findIndex((c: any) => c.id === config.id);
              if (index === -1) return new Response('Config not found', { status: 404 });
              state.agentConfigs[index] = config;
              return createJsonResponse(config);
            }
          }

          return new Response('Not Found', { status: 404 });
        } catch (err) {
          console.error('DEV ORCHESTRATION AGENT ERROR', err);
          return new Response('Internal Error', { status: 500 });
        }
      },
    };

    (globalThis as any)[globalKey] = stub;
  }

  return (globalThis as any)[globalKey] as DurableObjectStub<OrchestrationAgent>;
}