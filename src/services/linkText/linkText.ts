import { FutureInstance, chain } from 'fluture';
import { AppError } from '@app/errors';
import { pipe } from 'fp-ts/lib/function';
import { dao } from '@app/adapters/dao/dao';

export function fetchMissingLinkText(): FutureInstance<AppError, void> {
  pipe(
    dao((repos) => repos.links.getLinksWithoutText),
    chain((links) => {})t
  );
}
