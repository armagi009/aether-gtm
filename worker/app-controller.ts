import { DurableObject } from 'cloudflare:workers';
import type { Env } from './core-utils';

export class AppController extends DurableObject<Env> {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  async fetch(request: Request): Promise<Response> {
    return new Response(JSON.stringify({ success: true, message: 'AppController alive' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
