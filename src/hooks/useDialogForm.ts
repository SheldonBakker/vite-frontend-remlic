import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';

interface UseDialogFormOptions<T, R> {
  initialData: T;
  onSubmit: (data: T)=> Promise<R>;
  onSuccess: (result: R)=> void;
  onClose: ()=> void;
  successMessage?: string;
  errorFallback?: string;
}

interface UseDialogFormReturn<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  isSubmitting: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent, validate?: ()=> string | null)=> Promise<void>;
  handleChange: <K extends keyof T>(field: K)=> (e: React.ChangeEvent<HTMLInputElement>)=> void;
  handleSelectChange: <K extends keyof T>(field: K)=> (value: T[K])=> void;
  reset: ()=> void;
  setError: (error: string | null)=> void;
}

/**
 * Hook for managing form state in dialogs.
 * Provides common patterns for form handling: loading state, error handling,
 * field changes, and form reset.
 */
export function useDialogForm<T extends Record<string, unknown>, R>(
  options: UseDialogFormOptions<T, R>,
): UseDialogFormReturn<T> {
  const { initialData, onSubmit, onSuccess, onClose, successMessage, errorFallback = 'An error occurred' } = options;

  const [formData, setFormData] = useState<T>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback((): void => {
    setFormData(initialData);
    setError(null);
  }, [initialData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent, validate?: ()=> string | null): Promise<void> => {
      e.preventDefault();
      setError(null);

      if (validate) {
        const validationError = validate();
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      setIsSubmitting(true);

      try {
        const result = await onSubmit(formData);
        onSuccess(result);
        onClose();
        reset();
        if (successMessage) {
          toast.success(successMessage);
        }
      } catch (err) {
        const message = getErrorMessage(err, errorFallback);
        setError(message);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSubmit, onSuccess, onClose, reset, successMessage, errorFallback],
  );

  const handleChange = useCallback(
    <K extends keyof T>(field: K) =>
      (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [],
  );

  const handleSelectChange = useCallback(
    <K extends keyof T>(field: K) =>
      (value: T[K]): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
      },
    [],
  );

  return {
    formData,
    setFormData,
    isSubmitting,
    error,
    handleSubmit,
    handleChange,
    handleSelectChange,
    reset,
    setError,
  };
}
