import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { SettingsSkeleton } from '@/components/skeletons/SettingsSkeleton';
import { ReminderSettingCard } from '@/components/settings/ReminderSettingCard';
import { ErrorCard } from '@/components/ui/error-card';
import { PageHeader } from '@/components/ui/page-header';
import {
  getReminderSettings,
  updateReminderSetting,
  type EntityType,
  type UpdateReminderSettingRequest,
} from '@/api/services/settingsApi';

const ENTITY_TYPES: EntityType[] = ['firearms', 'vehicles', 'certificates', 'psira_officers'];

export default function SettingsPage(): React.JSX.Element {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['reminderSettings'],
    queryFn: getReminderSettings,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ entityType, data }: { entityType: EntityType; data: UpdateReminderSettingRequest }) =>
      updateReminderSetting(entityType, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reminderSettings'] });
      toast.success('Setting updated successfully');
    },
    onError: (err) => {
      const message = err instanceof AxiosError
        ? err.response?.data?.error?.message ?? err.message
        : 'Failed to update setting';
      toast.error(message);
    },
  });

  const { mutate, isPending, variables } = updateMutation;

  const handleUpdate = useCallback(
    (entityType: EntityType, data: UpdateReminderSettingRequest): void => {
      mutate({ entityType, data });
    },
    [mutate],
  );

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  if (isError) {
    const errorMessage = error instanceof AxiosError
      ? error.response?.data?.error ?? error.message
      : 'An error occurred loading settings';

    return <ErrorCard message={errorMessage} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reminder Settings"
        description="Configure when to receive reminders before your licenses and certifications expire."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {ENTITY_TYPES.map((entityType) => {
          const setting = settings?.[entityType] ?? null;
          return (
            <ReminderSettingCard
              key={`${entityType}-${setting?.updated_at ?? 'new'}`}
              entityType={entityType}
              setting={setting}
              onUpdate={handleUpdate}
              isUpdating={isPending && variables?.entityType === entityType}
            />
          );
        })}
      </div>
    </div>
  );
}
