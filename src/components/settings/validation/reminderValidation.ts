import { z } from 'zod';

export const MAX_REMINDER_DAYS = 4;
export const MIN_DAY_VALUE = 1;
export const MAX_DAY_VALUE = 365;

export const reminderDaySchema = z
  .number()
  .int('Must be a whole number')
  .min(MIN_DAY_VALUE, `Must be at least ${MIN_DAY_VALUE}`)
  .max(MAX_DAY_VALUE, `Must be at most ${MAX_DAY_VALUE}`);

export const reminderDaysSchema = z
  .array(reminderDaySchema)
  .max(MAX_REMINDER_DAYS, `Maximum ${MAX_REMINDER_DAYS} reminder days allowed`)
  .refine(
    (days) => new Set(days).size === days.length,
    'Duplicate values are not allowed',
  );

export interface ParseResult {
  days: number[];
  error: string | null;
}

export function parseReminderDays(input: string): ParseResult {
  if (!input.trim()) {
    return { days: [], error: null };
  }

  const parts = input.split(',').map((s) => s.trim()).filter(Boolean);

  // Check for non-numeric values first
  const numbers: number[] = [];
  for (const part of parts) {
    const num = parseInt(part, 10);
    if (isNaN(num) || part !== num.toString()) {
      return { days: [], error: `"${part}" is not a valid number` };
    }
    numbers.push(num);
  }

  // Validate with Zod schema
  const result = reminderDaysSchema.safeParse(numbers);

  if (!result.success) {
    const firstError = result.error.issues[0];
    return { days: [], error: firstError.message };
  }

  return { days: result.data.sort((a, b) => b - a), error: null };
}

export function formatReminderDays(days: number[]): string {
  return days.join(', ');
}
