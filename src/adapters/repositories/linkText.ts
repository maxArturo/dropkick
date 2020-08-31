import { DbClient } from '@app/adapters/dao';
import { LinkText } from '@app/domain';
import { linkTextCodec } from '@app/domain/linkText';
import { AppError } from '@app/errors/errors';
import { validateDbResult } from '@app/util';
import { camelCaseKeys } from '@app/util/functions';
import { chain, FutureInstance, map } from 'fluture';
import { pipe } from 'fp-ts/lib/pipeable';
import { Reader } from 'fp-ts/lib/Reader';
import * as t from 'io-ts';
import sql from 'sql-template-strings';

const save: (linkText: LinkText) => Reader<{ db: DbClient }, FutureInstance<AppError, void>> = (
  link
) => ({ db }) => {
  const query = sql`
        INSERT INTO link_text(
                            id 
                          , link_id
                          , link_text
                          , retry_count
                          , created_at
                          )
        VALUES (
                  ${link.id}
                , ${link.linkId}
                , ${link.linkText}
                , ${link.retryCount}
                , ${link.createdAt}
               )
               ON CONFLICT (link_id) DO UPDATE SET 
               link_text = excluded.link_text,
               retry_count = excluded.retry_count,
               created_at = excluded.created_at
      `;

  return db.run(query).pipe(map(() => void 0));
};

const getLinkText: (
  linkId: string
) => Reader<{ db: DbClient }, FutureInstance<AppError, LinkText>> = (linkId) => ({ db }) => {
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
