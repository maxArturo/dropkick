import { Link } from '@app/domain';
import { AppErrorType } from '@app/errors';
import { FutureInstance, map, parallel } from 'fluture';
import { hackerNews } from '@app/services/links/linkProviders';
import { pipe } from 'fp-ts/function';

type linkProvider = {
  fetchLinks(): FutureInstance<AppErrorType, Array<Link>>;
};

const linkProviders: Array<linkProvider> = [hackerNews];

export function fetchLinks(): FutureInstance<AppErrorType, Array<Link>> {
  return pipe(
    parallel(2)(linkProviders.map((provider) => provider.fetchLinks())),
    map((res: Array<Array<Link>>) => res.flat())
  );
}
