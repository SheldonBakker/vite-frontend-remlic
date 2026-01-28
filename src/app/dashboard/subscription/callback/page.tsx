import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSubscriptionContext } from '@/context/subscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

type CallbackStatus = 'processing' | 'success' | 'failed';

export default function SubscriptionCallbackPage(): React.JSX.Element {
  const [status, setStatus] = useState<CallbackStatus>('processing');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshPermissions } = useSubscriptionContext();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) {
      return;
    }

    const processCallback = async (): Promise<void> => {
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref');

      if (!reference && !trxref) {
        setStatus('failed');
        toast.error('Invalid payment callback');
        return;
      }

      processedRef.current = true;

      try {
        await refreshPermissions();
        void queryClient.invalidateQueries({ queryKey: ['subscription'] });
        void queryClient.invalidateQueries({ queryKey: ['packages'] });

        setStatus('success');
        toast.success('Subscription activated successfully!');

        window.setTimeout(() => {
          void navigate('/dashboard/subscription', { replace: true });
        }, 2000);
      } catch {
        processedRef.current = false;
        setStatus('failed');
        toast.error('Failed to verify payment. Please contact support if you were charged.');
      }
    };

    void processCallback();
  }, [searchParams, navigate, queryClient, refreshPermissions]);

  const renderContent = (): React.JSX.Element => {
    switch (status) {
      case 'processing':
        return (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
            <CardTitle>Processing Payment</CardTitle>
            <CardDescription className="mt-2">
              Please wait while we confirm your payment...
            </CardDescription>
          </>
        );
      case 'success':
        return (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <CardTitle>Payment Successful!</CardTitle>
            <CardDescription className="mt-2">
              Your subscription has been activated. Redirecting...
            </CardDescription>
          </>
        );
      case 'failed':
        return (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Payment Failed</CardTitle>
            <CardDescription className="mt-2">
              There was an issue processing your payment. Please try again or contact support.
            </CardDescription>
          </>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {renderContent()}
        </CardHeader>
        {status === 'failed' && (
          <CardContent className="flex justify-center">
            <button
              onClick={() => {
                void navigate('/dashboard/subscription', { replace: true });
              }}
              className="text-primary hover:underline"
            >
              Back to Subscription
            </button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
