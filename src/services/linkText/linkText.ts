import { FutureInstance, map, parallel } from 'fluture';
import { v4 as uuid } from 'uuid';
import { AppError } from '@app/errors';
import { dao } from '@app/adapters/dao/dao';
import { DateTime } from 'luxon';
import { Link, LinkText } from '@app/domain';

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
