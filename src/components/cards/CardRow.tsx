import { cn } from '@/lib/utils';

interface CardRowProps {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  mono?: boolean;
}

export function CardRow({ label, value, valueClassName, mono }: CardRowProps): React.JSX.Element {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn(mono && 'font-mono text-xs', valueClassName)}>{value}</span>
    </div>
  );
}
