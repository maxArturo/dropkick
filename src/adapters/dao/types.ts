import { ISqlite } from 'sqlite';
import { FutureInstance } from 'fluture';
import { AppError } from '@app/errors';

export type DbOperation = (
  query: ISqlite.SqlType,
  args?: Record<string, any>
) => FutureInstance<AppError, unknown>;

export type DbClient = {
  run: DbOperation;
  get: DbOperation;
  all: DbOperation;
};
