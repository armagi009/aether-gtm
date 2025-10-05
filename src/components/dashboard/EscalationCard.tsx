import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing } from 'lucide-react';
import type { Escalation } from '../../../worker/types';
interface EscalationCardProps {
  escalation: Escalation;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}
export function EscalationCard({ escalation, onApprove, onDeny }: EscalationCardProps) {
  return (
    <Card className="bg-background border-2 border-electric-yellow rounded-none flex flex-col">
      <CardHeader className="p-4 flex flex-row items-start space-x-4">
        <div className="bg-electric-yellow text-background p-2">
          <BellRing className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold font-mono uppercase tracking-wider text-electric-yellow">
            {escalation.reason}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Flagged by {escalation.agent} - {escalation.timestamp}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-foreground">{escalation.details}</p>
      </CardContent>
      <CardFooter className="p-4 flex space-x-2 bg-gray-900 border-t-2 border-electric-yellow">
        <Button
          onClick={() => onApprove(escalation.id)}
          className="flex-1 bg-electric-yellow text-background font-bold uppercase tracking-widest rounded-none hover:bg-foreground hover:text-background border-2 border-foreground"
        >
          Approve
        </Button>
        <Button
          onClick={() => onDeny(escalation.id)}
          variant="outline"
          className="flex-1 bg-background text-foreground font-bold uppercase tracking-widest rounded-none hover:bg-destructive hover:text-destructive-foreground border-2 border-foreground"
        >
          Deny
        </Button>
      </CardFooter>
    </Card>
  );
}