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

const APK_DOWNLOAD_URL = 'https://drive.google.com/file/d/12nt6mRFVLEMMqg2Y8IgaGyBvupTJh3RV/view?usp=sharing';

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
            App Store and Play Store builds coming soon.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Offline APK available for Android only. Download here.
        </p>
        <DialogFooter className="sm:justify-start">
          <Button asChild>
            <a
              href={APK_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="h-4 w-4" />
              Download Android APK
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
