import { chain, FutureInstance, map, parallel } from 'fluture';
import { v4 as uuid } from 'uuid';
import { AppError } from '@app/errors';
import { pipe } from 'fp-ts/lib/function';
import { dao } from '@app/adapters/dao/dao';
import { fetchPage } from '@app/adapters/browser';
import { DateTime } from 'luxon';
import { Link } from '@app/domain';

export function fetchMissingLinkText(): FutureInstance<AppError, void> {
  return pipe(
    dao((repos) => repos.links.getLinksWithoutText),
    chain((links) => {
      return parallel(1)(links.map((link) => fetchTextForLink(link)));
    }),
    map(() => void 0)
  );
}

function fetchTextForLink(link: Link): FutureInstance<AppError, void> {
  return pipe(
    fetchPage(link.url),
    chain((text) => {
      return dao((r) =>
        r.linkText.save({
          id: uuid(),
          linkId: link.id,
          linkText: text,
          createdAt: DateTime.local().toISO() ?? '',
        })
      );
    })
  );
}
