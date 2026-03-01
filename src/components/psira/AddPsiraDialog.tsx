import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  lookupPsiraOfficer,
  createPsiraOfficer,
  type PsiraOfficer,
  type SavedPsiraOfficer,
} from '@/api/services/psiraApi';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Search, User, Calendar, Shield, Loader2 } from 'lucide-react';

interface AddPsiraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onSuccess: (officer: SavedPsiraOfficer)=> void;
}

export function AddPsiraDialog({ open, onOpenChange, onSuccess }: AddPsiraDialogProps): React.JSX.Element {
  const [idNumber, setIdNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<PsiraOfficer[] | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState<PsiraOfficer | null>(null);

  const resetState = (): void => {
    setIdNumber('');
    setSearchResults(null);
    setSelectedOfficer(null);
    setError(null);
  };

  const handleOpenChange = (isOpen: boolean): void => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  const handleSearch = async (): Promise<void> => {
    if (!idNumber.trim()) {
      setError('Please enter an ID number');
      return;
    }

    if (!/^\d{13}$/.test(idNumber.trim())) {
      setError('ID number must be exactly 13 digits');
      return;
    }

    setError(null);
    setIsSearching(true);
    setSearchResults(null);
    setSelectedOfficer(null);

    try {
      const results = await lookupPsiraOfficer(idNumber.trim());
      setSearchResults(results);
      if (results.length === 0) {
        setError('No PSIRA records found for this ID number');
      } else if (results.length === 1) {
        setSelectedOfficer(results[0]);
      }
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error?.message ?? err.message
        : err instanceof Error ? err.message : 'Failed to search PSIRA records';
      setError(message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!selectedOfficer) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const savedOfficer = await createPsiraOfficer({
        IDNumber: idNumber.trim(),
        FirstName: selectedOfficer.FirstName,
        LastName: selectedOfficer.LastName,
        Gender: selectedOfficer.Gender,
        RequestStatus: selectedOfficer.RequestStatus,
        SIRANo: selectedOfficer.SIRANo,
        ExpiryDate: selectedOfficer.ExpiryDate,
      });
      onSuccess(savedOfficer);
      handleOpenChange(false);
      toast.success('PSIRA record saved successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error?.message ?? err.message
        : err instanceof Error ? err.message : 'Failed to save PSIRA record';
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add PSIRA Record</DialogTitle>
          <DialogDescription>
            Search for a security officer by their South African ID number.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <div className="flex gap-2">
              <Input
                id="idNumber"
                placeholder="Enter 13-digit ID number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={13}
                disabled={isSearching}
              />
              <Button
                type="button"
                onClick={() => void handleSearch()}
                disabled={isSearching || !idNumber.trim()}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {searchResults && searchResults.length > 0 && (
            <div className="grid gap-2">
              <Label>Search Results</Label>
              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {searchResults.map((officer, index) => (
                  <Card
                    key={`${officer.SIRANo}-${index}`}
                    className={`cursor-pointer transition-colors ${
                      selectedOfficer?.SIRANo === officer.SIRANo
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedOfficer(officer)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 font-medium">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {officer.FirstName} {officer.LastName}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            SIRA: {officer.SIRANo}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Expires: {officer.ExpiryDate}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            officer.RequestStatus === 'Registered'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {officer.RequestStatus}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {officer.Gender}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={!selectedOfficer || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Record'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
