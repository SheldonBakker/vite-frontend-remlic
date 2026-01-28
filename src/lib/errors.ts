import type { AxiosError } from 'axios';

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const responseError = err.response?.data as ApiErrorResponse | undefined;
    if (responseError?.error) {
      return responseError.error;
    }
    if (responseError?.message) {
      return responseError.message;
    }
    if (err.message) {
      return err.message;
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === 'string') {
    return err;
  }

  return fallback;
}

function isAxiosError(err: unknown): err is AxiosError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'isAxiosError' in err &&
    (err as AxiosError).isAxiosError === true
  );
}
