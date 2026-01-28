import { useState, useCallback } from 'react';
import { Crosshair, Car, Award, Shield, type LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { EntityType, ReminderSetting, UpdateReminderSettingRequest } from '@/api/services/settingsApi';
import { parseReminderDays, formatReminderDays } from './validation/reminderValidation';

interface EntityConfig {
  title: string;
  description: string;
  icon: LucideIcon;
}

const ENTITY_CONFIG: Record<EntityType, EntityConfig> = {
  firearms: {
    title: 'Firearms',
    description: 'Reminder settings for firearm license expiry',
    icon: Crosshair,
  },
  vehicles: {
    title: 'Vehicles',
    description: 'Reminder settings for vehicle license expiry',
    icon: Car,
  },
  certificates: {
    title: 'Certificates',
    description: 'Reminder settings for certificate expiry',
    icon: Award,
  },
  psira_officers: {
    title: 'PSIRA Records',
    description: 'Reminder settings for PSIRA registration expiry',
    icon: Shield,
  },
};

interface ReminderSettingCardProps {
  entityType: EntityType;
  setting: ReminderSetting | null;
  onUpdate: (entityType: EntityType, data: UpdateReminderSettingRequest)=> void;
  isUpdating: boolean;
}

export function ReminderSettingCard({
  entityType,
  setting,
  onUpdate,
  isUpdating,
}: ReminderSettingCardProps): React.JSX.Element {
  const config = ENTITY_CONFIG[entityType];
  const Icon = config.icon;

  // Initialize from server state (component remounts via key when server data changes)
  const [isEnabled, setIsEnabled] = useState(setting?.is_enabled ?? false);
  const [daysInput, setDaysInput] = useState(formatReminderDays(setting?.reminder_days ?? []));
  const [validationError, setValidationError] = useState<string | null>(null);

  const serverEnabled = setting?.is_enabled ?? false;
  const serverDays = formatReminderDays(setting?.reminder_days ?? []);
  const hasChanges = isEnabled !== serverEnabled || daysInput !== serverDays;

  const handleDaysChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setDaysInput(value);

    const { error } = parseReminderDays(value);
    setValidationError(error);
  }, []);

  const handleSave = useCallback((): void => {
    const { days, error } = parseReminderDays(daysInput);
    if (error) {
      setValidationError(error);
      return;
    }

    onUpdate(entityType, {
      is_enabled: isEnabled,
      reminder_days: days,
    });
  }, [entityType, isEnabled, daysInput, onUpdate]);

  const handleToggle = useCallback((checked: boolean): void => {
    setIsEnabled(checked);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </div>
        </div>
        <CardAction>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={isUpdating}
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor={`reminder-days-${entityType}`}>
            Reminder days before expiry
          </Label>
          <Input
            id={`reminder-days-${entityType}`}
            placeholder="e.g., 7, 14, 30, 60"
            value={daysInput}
            onChange={handleDaysChange}
            disabled={isUpdating || !isEnabled}
            aria-invalid={validationError ? 'true' : undefined}
          />
          {validationError && (
            <p className="text-sm text-destructive">{validationError}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Enter up to 4 values separated by commas. Each value represents how many days before expiry you&apos;ll be reminded (e.g., &quot;30, 14, 7&quot; sends reminders 30, 14, and 7 days before).
          </p>
        </div>
      </CardContent>
      {hasChanges && (
        <CardFooter className="border-t pt-4">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isUpdating || !!validationError}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
