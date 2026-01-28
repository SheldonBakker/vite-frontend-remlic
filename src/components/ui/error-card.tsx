import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ErrorCardProps {
  title?: string;
  message: string;
}

export function ErrorCard({ title = 'Error', message }: ErrorCardProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
