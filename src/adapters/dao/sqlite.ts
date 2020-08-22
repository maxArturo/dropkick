import { appConfig } from '@app/config';
import { AppError, ErrorType, fromNodeError } from '@app/errors/errors';
import { noop } from '@app/util/functions';
import Future, { bimap, encaseP, FutureInstance, hook } from 'fluture';
import { pipe } from 'fp-ts/function';
import { Database, ISqlite, open } from 'sqlite';
import sqlite3 from 'sqlite3';

type DbOperation = (
  query: ISqlite.SqlType,
  args?: Record<string, any>
) => FutureInstance<AppError, unknown>;

export type DbClient = {
  run: DbOperation;
  get: DbOperation;
  all: DbOperation;
  client: Database;
};

const connect = pipe(
  encaseP((config: ISqlite.Config) => open(config).then((db) => db.migrate().then(() => db)))({
    driver: sqlite3.Database,
    filename: appConfig.databaseLocation,
  }),
  bimap(fromNodeError(ErrorType.db))(
    (db): DbClient => {
      return {
        run: operation(db.run.bind(db)),
        get: operation(db.get.bind(db)),
        all: operation(db.all.bind(db)),
        client: db,
      };
    }
  )
);

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

export const withDb = hook(connect)((db) =>
  Future((_rej, res) => {
    db.client.close().then(() => res(void 0));
    return noop;
  })
);
