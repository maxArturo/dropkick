import { links, linkText } from '../repositories';
import { DbClient, withDb } from '@app/adapters/dao/sqlite';
import { FutureInstance } from 'fluture';
import { AppError } from '@app/errors';

const repositories = (db: DbClient) => {
  return {
    links: {
      getLinksWithMissingText: links.getLinksWithMissingText(db),
      saveLinks: links.saveLinks(db),
      getLatestLinks: links.getLatestLinks(db),
    },
    linkText: { save: linkText.save(db), getLinkText: linkText.getLinkText(db) },
  };
};

type Repository = ReturnType<typeof repositories>;

export const dao = <A>(
  task: (repos: Repository) => FutureInstance<AppError, A>
): FutureInstance<AppError, A> =>
  withDb((db) => {
    const repos = repositories(db);
    return task(repos);
  });
