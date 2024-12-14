export class AppError extends Error {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, defaultMessage: string): AppError {
  if (error instanceof Error) {
    return new AppError(error.message, error);
  }
  return new AppError(defaultMessage, error);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ett oväntat fel inträffade';
}