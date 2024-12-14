
export class OcrError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'OcrError';
  }
}

export class ValidationError extends OcrError {
  constructor(message: string, public fields?: string[]) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class ApiError extends OcrError {
  constructor(message: string, public status?: number) {
    super(message, 'API_ERROR');
    this.name = 'ApiError';
  }
}

export class ParseError extends OcrError {
  constructor(message: string) {
    super(message, 'PARSE_ERROR');
    this.name = 'ParseError';
  }
}

export function handleOcrError(error: unknown): Error {
  if (error instanceof OcrError) {
    return error;
  }

  if (error instanceof Error) {
    return new OcrError(error.message);
  }

  return new OcrError('Ett okänt fel uppstod');
}