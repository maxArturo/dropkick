import { DbClient } from '@app/adapters/dao';
import { appConfig } from '@app/config';
import { Link } from '@app/domain';
import { linkCodec } from '@app/domain/link';
import { LinkWithText, linkWithTextCodec } from '@app/domain/linkWithText';
import { AppError } from '@app/errors/errors';
import { validateDbResult } from '@app/util';
import { camelCaseKeys } from '@app/util/functions';
import { chain, FutureInstance, map, parallel } from 'fluture';
import { pipe } from 'fp-ts/lib/pipeable';
import { Reader } from 'fp-ts/lib/Reader';
import * as t from 'io-ts';
import sql from 'sql-template-strings';

const saveLinks: (
  links: Array<Link>
) => Reader<{ db: DbClient }, FutureInstance<AppError, void>> = (linksToSave) => ({ db }) => {
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

const getLatestLinks: Reader<{ db: DbClient }, FutureInstance<AppError, Array<Link>>> = ({
  db,
}) => {
  const query = sql`
    WITH latestLinks as (
        SELECT id, title, source, url, comments_url, comments_count, created_at,
               ROW_NUMBER() OVER(PARTITION BY source ORDER BY created_at DESC) as row_num
        FROM links
    ) SELECT * from latestLinks where row_num <= ${appConfig.homeViewLinkCount}
      `;

  return pipe(
    db.all(query),
    chain(validateDbResult('validateArray')(t.array(t.record(t.string, t.unknown)))),
    map((rows: Array<Record<string, unknown>>) => rows.map(camelCaseKeys)),
    chain(validateDbResult('getLatestLinks')(t.array(linkCodec)))
  );
};

const getLinksWithMissingText: Reader<
  { db: DbClient },
  FutureInstance<AppError, Array<LinkWithText>>
> = ({ db }) => {
  const query = sql`
    SELECT links.*, lt.link_text, lt.retry_count from links 
        LEFT JOIN link_text lt on links.id = lt.link_id
    where 
        lt.id IS NULL OR
        (lt.retry_count <= ${appConfig.linkTextFetchRetryCount} AND lt.link_text IS NULL) 
  `;

  return pipe(
    db.all(query),
    chain(validateDbResult('validateArray')(t.array(t.record(t.string, t.unknown)))),
    map((rows: Array<Record<string, unknown>>) => rows.map(camelCaseKeys)),
    chain(validateDbResult('getLatestLinks')(t.array(linkWithTextCodec)))
  );
};

export const links = { saveLinks, getLatestLinks, getLinksWithMissingText };
