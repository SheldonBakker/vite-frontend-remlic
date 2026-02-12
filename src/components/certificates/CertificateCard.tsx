import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EditCertificateDialog } from '@/components/certificates/EditCertificateDialog';
import { Trash2, Calendar, Award, Pencil } from 'lucide-react';
import type { Certificate } from '@/api/services/certificatesApi';
import { getExpiryBadgeProps } from '@/lib/utils';

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

  const expiryStatus = getExpiryBadgeProps(certificate.expiry_date);

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
              <span>{formatDate(certificate.expiry_date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={expiryStatus.variant}>{expiryStatus.label}</Badge>
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
