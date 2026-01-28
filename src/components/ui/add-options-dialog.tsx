import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crosshair, Shield, Car } from 'lucide-react';

interface AddOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onAddFirearm: ()=> void;
  onAddPsira: ()=> void;
  onAddVehicle: ()=> void;
}

export function AddOptionsDialog({
  open,
  onOpenChange,
  onAddFirearm,
  onAddPsira,
  onAddVehicle,
}: AddOptionsDialogProps): React.JSX.Element {
  const handleAddFirearm = (): void => {
    onOpenChange(false);
    onAddFirearm();
  };

  const handleAddPsira = (): void => {
    onOpenChange(false);
    onAddPsira();
  };

  const handleAddVehicle = (): void => {
    onOpenChange(false);
    onAddVehicle();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Record</DialogTitle>
          <DialogDescription>
            Choose what type of record you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="h-20 flex flex-col gap-2 justify-center"
            onClick={handleAddFirearm}
          >
            <Crosshair className="h-6 w-6" />
            <span>Add Firearm</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col gap-2 justify-center"
            onClick={handleAddPsira}
          >
            <Shield className="h-6 w-6" />
            <span>Add PSIRA Record</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col gap-2 justify-center"
            onClick={handleAddVehicle}
          >
            <Car className="h-6 w-6" />
            <span>Add Vehicle</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
