import { Link } from '@app/domain';
import { AppError } from '@app/errors';
import { chain, FutureInstance, map, parallel } from 'fluture';
import { hackerNews } from '@app/services/links/linkProviders';
import { pipe } from 'fp-ts/function';
import { scheduleFuture } from '@app/services/schedule';
import { appConfig } from '@app/config';
import { dao } from '@app/adapters/dao/dao';
import { fetchMissingLinkText } from '@app/services/linkText';

type linkProvider = {
  fetchLinks(): FutureInstance<AppError, Array<Link>>;
};

const linkProviders: Array<linkProvider> = [hackerNews];

export function fetchLinks(): FutureInstance<AppError, Array<Link>> {
  return pipe(
    parallel(2)(linkProviders.map((provider) => provider.fetchLinks())),
    map((res: Array<Array<Link>>) => res.flat())
  );
}

export function scheduleFetchLinks(): void {
  return scheduleFuture(
    pipe(
      fetchLinks(),
      chain((links) => dao((repos) => repos.links.saveLinks(links))),
      chain(() => fetchMissingLinkText())
    ),
    appConfig.linkFetchInterval
  );
}
