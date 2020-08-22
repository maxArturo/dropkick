import { DbClient } from '@app/adapters/dao/sqlite';
import { Link } from '@app/domain';
import { AppError } from '@app/errors/errors';
import { FutureInstance, parallel, map } from 'fluture';
import sql from 'sql-template-strings';

const saveLinks: (db: DbClient) => (links: Array<Link>) => FutureInstance<AppError, void> = (
  db
) => (linksToSave) => {
  const insertOperations = linksToSave.map((link) => {
    return db.run(
      sql`
        INSERT INTO links(
                            id 
                          , title 
                          , source 
                          , url 
                          , comments_url 
                          , comments_count 
                          , created_at
                          )
        VALUES (
                ${link.id}
                , ${link.title}
                , ${link.source}
                , ${link.url}
                , ${link.commentsUrl}
                , ${link.commentsCount}
                , ${link.createdAt}
               )
               ON CONFLICT (url) DO NOTHING 
      `
    );
  });

  return parallel(5)(insertOperations).pipe(map(() => void 0));
};

export const links = { saveLinks };
