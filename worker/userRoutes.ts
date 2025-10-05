import { Hono } from "hono";
import { Env, getOrchestrationAgent } from "./core-utils";
import { API_RESPONSES } from "./config";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  const gtmApi = new Hono<{ Bindings: Env }>();
  // Middleware to forward requests to the OrchestrationAgent DO
  gtmApi.all('*', async (c) => {
    try {
      const agent = getOrchestrationAgent(c.env);
      // Reconstruct the request to be forwarded
      const url = new URL(c.req.url);
      // The path needs to be relative to the DO, so we strip the base path
      const path = url.pathname.replace('/api/v1/gtm_system', '');
      const forwardedUrl = new URL(path, url.origin);
      const request = new Request(forwardedUrl, c.req.raw);
      return agent.fetch(request);
    } catch (error) {
      console.error('OrchestrationAgent routing error:', error);
      return c.json({
        success: false,
        error: API_RESPONSES.AGENT_ROUTING_FAILED
      }, { status: 500 });
    }
  });
  app.route('/api/v1/gtm_system', gtmApi);
}