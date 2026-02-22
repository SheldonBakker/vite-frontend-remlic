import { Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const PLAY_STORE_TESTING_URL = 'https://play.google.com/apps/testing/za.co.remlic.mobile';

export function MobileAppDownloadDialog(): React.JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Open mobile app download options"
        >
          <Smartphone className="h-4 w-4 sm:mr-2" />
          <span className="sr-only sm:not-sr-only">Mobile App Download</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mobile App Download</DialogTitle>
          <DialogDescription>
            The Android app is currently in closed testing on Google Play.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Join the closed testing program to get early access. App Store build coming soon.
        </p>
        <DialogFooter className="sm:justify-start">
          <Button asChild>
            <a
              href={PLAY_STORE_TESTING_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="h-4 w-4" />
              Join Closed Testing
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
