import * as t from 'io-ts';
import { DbClient } from '@app/adapters/dao/sqlite';
import { Link } from '@app/domain';
import { AppError } from '@app/errors/errors';
import { chain, FutureInstance, map, parallel } from 'fluture';
import sql from 'sql-template-strings';
import { validateDbResult } from '@app/util';
import { pipe } from 'fp-ts/lib/pipeable';
import { linkCodec } from '@app/domain/link';
import { camelCaseKeys } from '@app/util/functions';

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

const getLatestLinks: (db: DbClient) => FutureInstance<AppError, Array<Link>> = (db) => {
  const query = sql`
    SELECT id, title, source, url, comments_url, comments_count, created_at FROM links
      `;

  return pipe(
    db.all(query),
    chain(validateDbResult('validateArray')(t.array(t.record(t.string, t.unknown)))),
    map((rows: Array<Record<string, unknown>>) => rows.map(camelCaseKeys)),
    chain(validateDbResult('getLatestLinks')(t.array(linkCodec)))
  );
};

export const links = { saveLinks, getLatestLinks };
