import { links } from './repositories/links';
import { DbClient, withDb } from '@app/adapters/dao/sqlite';
import { FutureInstance } from 'fluture';
import { AppError } from '@app/errors';

const repositories = (db: DbClient) => {
  return {
    links: { saveLinks: links.saveLinks(db), getLatestLinks: links.getLatestLinks(db) },
  };
};

export const dao = <A>(
  task: (repos: ReturnType<typeof repositories>) => FutureInstance<AppError, A>
): FutureInstance<AppError, A> =>
  withDb((db) => {
    const repos = repositories(db);
    return task(repos);
  });
