export enum ErrorType {
  default = 'default',
  http = 'http',
  validation = 'validation',
  db = 'db',
}

interface errorDetails {
  message: string;
  metadata: Record<string, unknown>;
  errorCode: number;
  stack?: string;
}

export interface DefaultError extends errorDetails {
  type: ErrorType.default;
}

export interface HttpError extends errorDetails {
  type: ErrorType.http;
}

export interface ValidationError extends errorDetails {
  type: ErrorType.validation;
}

export interface DbError extends errorDetails {
  type: ErrorType.db;
}

export interface AppError extends errorDetails {
  type: string;
}

export const fromNodeError: (type: ErrorType) => (e: any) => AppError = (type) => (e: any) => ({
  message: e.message ?? 'unknown error occurred',
  errorCode: 500,
  type,
  stack: e.stack,
  metadata: { ...e },
});
