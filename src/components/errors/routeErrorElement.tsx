import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Seo } from '@/components/seo';
import { PAGE_SEO } from '@/constants/seo';

export default function RouteErrorElement(): React.JSX.Element {
  const error = useRouteError();

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred.';
  let is404 = false;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page not found';
      message = 'The page you are looking for does not exist or has been moved.';
      is404 = true;
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
      {is404 && (
        <Seo
          title={PAGE_SEO.notFound.title}
          description={PAGE_SEO.notFound.description}
          path={PAGE_SEO.notFound.path}
          noIndex={PAGE_SEO.notFound.noIndex}
        />
      )}
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          <CardDescription className="text-center">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="text-8xl font-bold text-muted-foreground/30">
            {is404 ? '404' : '!'}
          </div>
          {is404 && (
            <p className="text-sm text-muted-foreground text-center">
              Try checking the URL or use the navigation to find what you&apos;re looking for.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Link to="/">
            <Button>Go to Homepage</Button>
          </Link>
          {is404 && (
            <Link to="/faq">
              <Button variant="outline">View FAQ</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
