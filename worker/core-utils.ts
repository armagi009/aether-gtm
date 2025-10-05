import type { OrchestrationAgent } from './orchestration-agent';
export interface Env {
  ORCHESTRATION_AGENT: DurableObjectNamespace<OrchestrationAgent>;
}
/**
 * Get OrchestrationAgent stub for GTM system state management.
 * Uses a singleton pattern with a fixed ID for consistent routing.
 */
export function getOrchestrationAgent(env: Env): DurableObjectStub<OrchestrationAgent> {
  const id = env.ORCHESTRATION_AGENT.idFromName("singleton");
  return env.ORCHESTRATION_AGENT.get(id);
}