import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';

interface RecordCardHeaderProps {
  title: string;
  icon?: React.ReactNode;
  onEdit?: ()=> void;
  onDelete?: ()=> void;
  isDeleting?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
}

export function RecordCardHeader({
  title,
  icon,
  onEdit,
  onDelete,
  isDeleting,
  showEditButton = true,
  showDeleteButton = true,
}: RecordCardHeaderProps): React.JSX.Element {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center gap-3">
        {icon}
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </div>
      <div className="flex gap-1">
        {showEditButton && onEdit && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onEdit}
            className="text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {showDeleteButton && onDelete && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            disabled={isDeleting}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </CardHeader>
  );
}
