import { Link } from '@app/domain';
import { AppErrorType } from '@app/errors';
import { FutureInstance, map, parallel } from 'fluture';
import { hackerNews } from '@app/services/links/linkProviders';
import { pipe } from 'fp-ts/function';
import { scheduleFuture } from '@app/services/schedule';
import { appConfig } from '@app/config';

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

export function scheduleLinkExtraction() {
  scheduleFuture(
    pipe(
      fetchLinks(),
      // TODO this will store the links in permanent storage in the future
      // eslint-disable-next-line no-console
      map((links) => console.log(links))
    ),
    appConfig.linkFetchInterval
  );
}
