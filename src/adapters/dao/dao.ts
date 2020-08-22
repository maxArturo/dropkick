import { links } from './repositories/links';
import { DbClient, withDb } from '@app/adapters/dao/sqlite';
import { FutureInstance } from 'fluture';
import { AppError } from '@app/errors';
import { Link } from '@app/domain';

const repositories = (db: DbClient) => {
  return {
    links: { saveLinks: links.saveLinks(db) },
  };
};

export type Repositories = {
  links: { saveLinks: (links: Array<Link>) => FutureInstance<AppError, void> };
};

export const dao = (
  task: (repos: Repositories) => FutureInstance<AppError, unknown>
): FutureInstance<AppError, unknown> =>
  withDb((db) => {
    const repos = repositories(db);
    return task(repos);
  });
