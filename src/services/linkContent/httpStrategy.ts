import * as t from 'io-ts';
import { LinkContentFetcher } from './fetchLinkContent';
import { http } from '@app/adapters';
import { pipe } from 'fp-ts/lib/function';
import { map, chain } from 'fluture';
import { getReadableDom } from './readability';
import { validateHttpResponse } from '@app/util';
import { log } from '@app/util/log';

export const httpContentFetcher: LinkContentFetcher = (url) => {
  log.info(`Fetching: ${url} via http method`);
  return pipe(
    http({
      url,
      method: 'get',
    }),
    chain(validateHttpResponse(url)(t.string)),
    map<string, string>((text) => {
      log.info(`Fetching: ${url} completed`);
      return getReadableDom(text, url);
    })
  );
};
