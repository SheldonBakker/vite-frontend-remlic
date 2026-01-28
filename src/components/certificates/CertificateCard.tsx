import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EditCertificateDialog } from '@/components/certificates/EditCertificateDialog';
import { Trash2, Calendar, Award, Pencil } from 'lucide-react';
import type { Certificate } from '@/api/services/certificatesApi';

interface CertificateCardProps {
  certificate: Certificate;
  onDelete: (id: string)=> void;
  onEdit: (certificate: Certificate)=> void;
  isDeleting?: boolean;
}

export function CertificateCard({ certificate, onDelete, onEdit, isDeleting }: CertificateCardProps): React.JSX.Element {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleConfirmDelete = (): void => {
    onDelete(certificate.id);
    setConfirmOpen(false);
  };

  const handleEditSuccess = (updatedCertificate: Certificate): void => {
    onEdit(updatedCertificate);
    setEditOpen(false);
  };

  const { isExpired, isExpiringSoon } = useMemo(() => {
    const now = new Date();
    const expiryDate = new Date(certificate.expiry_date);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expired = expiryDate < now;
    return {
      isExpired: expired,
      isExpiringSoon: !expired && expiryDate < thirtyDaysFromNow,
    };
  }, [certificate.expiry_date]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-muted-foreground" />
            <CardTitle className="text-base font-medium">
              {certificate.type}
            </CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setEditOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setConfirmOpen(true)}
              disabled={isDeleting}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span>{certificate.first_name} {certificate.last_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Certificate No.</span>
              <span className="font-mono text-xs">{certificate.certificate_number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Expires
              </span>
              <span className={
                isExpired
                  ? 'text-destructive font-medium'
                  : isExpiringSoon
                    ? 'text-orange-500 font-medium'
                    : ''
              }>
                {formatDate(certificate.expiry_date)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Certificate"
        description={`Are you sure you want to delete the ${certificate.type} certificate for ${certificate.first_name} ${certificate.last_name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
      <EditCertificateDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={handleEditSuccess}
        certificate={certificate}
      />
    </>
  );
}
