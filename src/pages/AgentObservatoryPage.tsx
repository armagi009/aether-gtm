import { AgentLogStream } from '@/components/observatory/AgentLogStream';
export function AgentObservatoryPage() {
  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-mono uppercase tracking-widest">Agent Intelligence Observatory</h1>
        <p className="text-muted-foreground">Raw, live-streaming view into agent decision-making processes.</p>
      </header>
      <div className="flex-grow">
        <AgentLogStream />
      </div>
    </div>
  );
}