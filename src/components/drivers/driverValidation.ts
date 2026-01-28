import { z } from 'zod';

const saIdNumberRegex = /^\d{13}$/;

function isValidSAIdDate(idNumber: string): boolean {
  const month = parseInt(idNumber.substring(2, 4), 10);
  const day = parseInt(idNumber.substring(4, 6), 10);

  if (month < 1 || month > 12) {
    return false;
  }
  if (day < 1 || day > 31) {
    return false;
  }

  return true;
}

export const driverFormSchema = z.object({
  surname: z
    .string()
    .min(1, 'Surname is required')
    .max(100, 'Surname must not exceed 100 characters')
    .trim(),

  initials: z
    .string()
    .min(1, 'Initials are required')
    .max(10, 'Initials must not exceed 10 characters')
    .regex(/^[A-Z.\s]+$/, 'Initials must contain only uppercase letters, periods, and spaces')
    .trim(),

  id_number: z
    .string()
    .regex(saIdNumberRegex, 'ID number must be exactly 13 digits')
    .refine(isValidSAIdDate, 'Invalid date in ID number (YYMMDD format)'),

  expiry_date: z
    .string()
    .min(1, 'Expiry date is required')
    .refine((date) => {
      const expiryDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return expiryDate > today;
    }, 'Expiry date must be in the future'),
});

export type DriverFormData = z.infer<typeof driverFormSchema>;
