import { appConfig } from '@app/config';
import { AppError, ErrorType, fromNodeError } from '@app/errors/errors';
import { noop } from '@app/util/functions';
import Future, { bimap, encaseP, FutureInstance, hook, resolve } from 'fluture';
import { ISqlite, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { DbClient } from './types';

export let db: DbClient;
(async () => {
  db = await open({
    driver: sqlite3.Database,
    filename: appConfig.databaseLocation,
  })
    .then((dbInstance) => dbInstance.migrate().then(() => dbInstance))
    .then((dbInstance) => ({
      run: operation(dbInstance.run.bind(dbInstance)),
      get: operation(dbInstance.get.bind(dbInstance)),
      all: operation(dbInstance.all.bind(dbInstance)),
    }));
})();

const operation: (
  op: (query: ISqlite.SqlType, args?: Record<string, any>) => Promise<unknown>
) => (query: ISqlite.SqlType, args?: Record<string, any>) => FutureInstance<AppError, unknown> = (
  op
) => (query: ISqlite.SqlType, args?: Record<string, any>) =>
  encaseP(({ sql, params }: { sql: ISqlite.SqlType; params?: Record<string, any> }) =>
    op(sql, params)
  )({
    sql: query,
    params: args,
  }).pipe(bimap(fromNodeError(ErrorType.db))((res) => res));

const connect = Future<AppError, DbClient>((_rej, res) => {
  res(db);
  return noop;
});

export const withDb = hook(connect)(() => resolve(noop));
