import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RouteErrorElement(): React.JSX.Element {
  const error = useRouteError();

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page not found';
      message = 'The page you are looking for does not exist.';
    } else if (error.status === 401) {
      title = 'Unauthorized';
      message = 'You are not authorized to view this page.';
    } else if (error.status === 403) {
      title = 'Forbidden';
      message = 'You do not have permission to access this page.';
    } else {
      message = error.statusText;
    }
  } else if (error instanceof Error) {
    const { message: errorMessage } = error;
    message = errorMessage;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          <CardDescription className="text-center">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="text-6xl">😕</div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/">
            <Button>Go back home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
