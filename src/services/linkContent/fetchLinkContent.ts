import { dao } from '@app/adapters/dao/dao';
import { appConfig } from '@app/config';
import { LinkWithText } from '@app/domain/linkWithText';
import { AppError } from '@app/errors';
import { bichain, chain, FutureInstance, map, parallel } from 'fluture';
import { pipe } from 'fp-ts/lib/function';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { browserContentFetcher } from './browserStrategy';
import { httpContentFetcher } from './httpStrategy';

export type LinkContentFetcher = (url: string) => FutureInstance<AppError, string>;

export function fetchMissingLinkText(): FutureInstance<AppError, void> {
  return pipe(
    dao((repos) => repos.links.getLinksWithMissingText),
    chain((links) => {
      return parallel(1)(links.map((link) => fetchTextForLink(link)));
    }),
    map(() => void 0)
  );
}

function fetchTextForLink(link: LinkWithText): FutureInstance<AppError, void> {
  return pipe(
    appConfig.fetchStrategy === 'browser'
      ? browserContentFetcher(link.url)
      : httpContentFetcher(link.url),
    bichain(() =>
      dao((r) =>
        r.linkText.save({
          id: uuid(),
          linkId: link.id,
          linkText: null,
          retryCount: link.retryCount + 1,
          createdAt: DateTime.local().toISO() ?? '',
        })
      )
    )((text) =>
      dao((r) =>
        r.linkText.save({
          id: uuid(),
          linkId: link.id,
          linkText: text,
          retryCount: link.retryCount,
          createdAt: DateTime.local().toISO() ?? '',
        })
      )
    )
  );
}
