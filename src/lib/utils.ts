import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
): string {
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function formatDateFull(dateString: string): string {
  return formatDate(dateString, { year: 'numeric', month: 'long', day: 'numeric' });
}

export interface ExpiryStatus {
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysUntilExpiry: number;
}

export function getExpiryStatus(expiryDate: string, daysThreshold = 30): ExpiryStatus {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    isExpired: daysUntilExpiry < 0,
    isExpiringSoon: daysUntilExpiry >= 0 && daysUntilExpiry <= daysThreshold,
    daysUntilExpiry,
  };
}

export function getExpiryStatusClasses(expiryDate: string, daysThreshold = 30): string {
  const { isExpired, isExpiringSoon } = getExpiryStatus(expiryDate, daysThreshold);

  if (isExpired) {
    return 'text-destructive';
  }
  if (isExpiringSoon) {
    return 'text-yellow-600 dark:text-yellow-500';
  }
  return 'text-muted-foreground';
}
