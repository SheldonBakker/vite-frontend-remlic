import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
}

export function InfoCard({ icon: Icon, title, value }: InfoCardProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{value}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
