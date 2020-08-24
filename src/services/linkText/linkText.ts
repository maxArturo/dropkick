import { bichain, chain, FutureInstance, map, parallel } from 'fluture';
import { v4 as uuid } from 'uuid';
import { AppError } from '@app/errors';
import { pipe } from 'fp-ts/lib/function';
import { dao } from '@app/adapters/dao/dao';
import { browser } from '@app/adapters';
import { DateTime } from 'luxon';
import { Link, LinkText } from '@app/domain';
import { LinkWithText } from '@app/domain/linkWithText';

export function initializeTextEntriesForLinks(links: Array<Link>): FutureInstance<AppError, void> {
  const emptyLinkTexts: Array<LinkText> = links.map((l) => ({
    id: uuid(),
    linkId: l.id,
    linkText: null,
    retryCount: 0,
    createdAt: DateTime.local().toISO() ?? '',
  }));

  const res = emptyLinkTexts.map((t) => dao((r) => r.linkText.save(t)));
  return parallel(5)(res).pipe(map(() => void 0));
}

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
    browser.fetchPage(link.url),
    bichain(() => {
      return dao((r) =>
        r.linkText.save({
          id: uuid(),
          linkId: link.id,
          linkText: null,
          retryCount: link.retryCount + 1,
          createdAt: DateTime.local().toISO() ?? '',
        })
      );
    })((text) => {
      return dao((r) =>
        r.linkText.save({
          id: uuid(),
          linkId: link.id,
          linkText: text,
          retryCount: link.retryCount,
          createdAt: DateTime.local().toISO() ?? '',
        })
      );
    })
  );
}
