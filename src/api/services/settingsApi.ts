import apiClient from './apiClient';

export type EntityType = 'firearms' | 'vehicles' | 'certificates' | 'psira_officers';

export interface ReminderSetting {
  id: string;
  profile_id: string;
  entity_type: EntityType;
  reminder_days: number[];
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReminderSettingsMap {
  firearms: ReminderSetting | null;
  vehicles: ReminderSetting | null;
  certificates: ReminderSetting | null;
  psira_officers: ReminderSetting | null;
}

export interface UpdateReminderSettingRequest {
  reminder_days?: number[];
  is_enabled?: boolean;
}

export interface BulkUpdateReminderSettingsRequest {
  settings: Array<{
    entity_type: EntityType;
    reminder_days: number[];
    is_enabled: boolean;
  }>;
}

interface ReminderSettingsResponse {
  success: boolean;
  data: {
    settings: ReminderSettingsMap;
  };
  timestamp: string;
  statusCode: number;
}

interface ReminderSettingResponse {
  success: boolean;
  data: {
    setting: ReminderSetting;
  };
  timestamp: string;
  statusCode: number;
}

export async function getReminderSettings(): Promise<ReminderSettingsMap> {
  const response = await apiClient.get<ReminderSettingsResponse>('/settings/reminders');
  return response.data.data.settings;
}

export async function updateReminderSetting(
  entityType: EntityType,
  data: UpdateReminderSettingRequest,
): Promise<ReminderSetting> {
  const response = await apiClient.patch<ReminderSettingResponse>(
    `/settings/reminders/${entityType}`,
    data,
  );
  return response.data.data.setting;
}

export async function bulkUpdateReminderSettings(
  data: BulkUpdateReminderSettingsRequest,
): Promise<ReminderSettingsMap> {
  const response = await apiClient.put<ReminderSettingsResponse>('/settings/reminders', data);
  return response.data.data.settings;
}

export async function deleteReminderSetting(entityType: EntityType): Promise<void> {
  await apiClient.delete(`/settings/reminders/${entityType}`);
}
