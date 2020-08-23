import * as t from 'io-ts';
import { DbClient } from '@app/adapters/dao/sqlite';
import { LinkText } from '@app/domain';
import { AppError } from '@app/errors/errors';
import { chain, FutureInstance, map } from 'fluture';
import sql from 'sql-template-strings';
import { validateDbResult } from '@app/util';
import { pipe } from 'fp-ts/lib/pipeable';
import { camelCaseKeys } from '@app/util/functions';
import { linkTextCodec } from '@app/domain/linkText';

const save: (db: DbClient) => (linkText: LinkText) => FutureInstance<AppError, void> = (db) => (
  link
) => {
  const query = sql`
        INSERT INTO link_text(
                            id 
                          , link_id
                          , link_text
                          , created_at
                          )
        VALUES (
                  ${link.id}
                , ${link.linkId}
                , ${link.linkText}
                , ${link.createdAt}
               )
               ON CONFLICT (link_id) DO NOTHING 
      `;

  return db.run(query).pipe(map(() => void 0));
};

const getLinkText: (db: DbClient) => (linkId: string) => FutureInstance<AppError, LinkText> = (
  db
) => (linkId) => {
  const query = sql`
     SELECT * from link_text where link_id = ${linkId};
      `;

  return pipe(
    db.get(query),
    chain(validateDbResult('validateRecord')(t.record(t.string, t.unknown))),
    map(camelCaseKeys),
    chain(validateDbResult('getLinkText')(linkTextCodec))
  );
};

export const linkText = { save, getLinkText };
