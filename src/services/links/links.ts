import { dao } from '@app/adapters/dao/dao';
import { appConfig } from '@app/config';
import { Link } from '@app/domain';
import { AppError } from '@app/errors';
import { fetchMissingLinkText } from '@app/services/linkContent';
import { initializeTextEntriesForLinks } from '@app/services/linkText';
import { scheduleFuture } from '@app/services/schedule';
import { chain, FutureInstance, map, parallel } from 'fluture';
import { pipe } from 'fp-ts/function';
import { linkProviders } from './linkProviders';

function fetchLinks(): FutureInstance<AppError, Array<Link>> {
  return pipe(
    parallel(2)(linkProviders.map((provider) => provider.fetchLinks())),
    map((res: Array<Array<Link>>) => res.flat())
  );
}

export function scheduleFetchLinks(): void {
  return scheduleFuture(
    pipe(
      fetchLinks(),
      chain((links) => {
        return pipe(
          dao((repos) => {
            return pipe(repos.links.saveLinks(links));
          }),
          chain(() => initializeTextEntriesForLinks(links))
        );
      }),
      chain(() => fetchMissingLinkText())
    ),
    appConfig.linkFetchInterval
  );
}
