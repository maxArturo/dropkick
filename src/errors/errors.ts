import * as t from 'io-ts';

export enum ErrorType {
  default = 'Error.Default',
  http = 'Error.Http',
  validation = 'Error.Validation',
}

const errorDetails = t.intersection([
  t.type({
    message: t.string,
    metadata: t.UnknownRecord,
    errorCode: t.number,
  }),
  t.partial({
    stack: t.string,
  }),
]);

export const defaultError = t.intersection([
  t.type({
    type: t.literal(ErrorType.default),
  }),
  errorDetails,
]);
export type DefaultErrorType = t.TypeOf<typeof defaultError>;

export const httpError = t.intersection([
  t.type({
    type: t.literal(ErrorType.http),
  }),
  errorDetails,
]);
export type HttpErrorType = t.TypeOf<typeof httpError>;

export const validationError = t.intersection([
  t.type({
    type: t.literal(ErrorType.validation),
  }),
  errorDetails,
]);
export type ValidationErrorType = t.TypeOf<typeof validationError>;

export const appError = t.union([defaultError, httpError, validationError]);
export type AppErrorType = t.TypeOf<typeof appError>;
