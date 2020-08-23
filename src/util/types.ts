import { FutureInstance } from 'fluture';
import { AppError } from '@app/errors';

export function assertNever(value: never): never {
  throw new Error('should not have value: ' + value);
}

export type Result<A> = FutureInstance<AppError, A>;
