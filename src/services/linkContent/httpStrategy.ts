import * as t from 'io-ts';
import { LinkContentFetcher } from './fetchLinkContent';
import { http } from '@app/adapters';
import { pipe } from 'fp-ts/lib/function';
import { map, chain } from 'fluture';
import { getReadableDom } from './readability';
import { validateHttpResponse } from '@app/util';

export const httpContentFetcher: LinkContentFetcher = (url) => {
  console.log(`Fetching: ${url} via http method`);
  return pipe(
    http({
      url,
      method: 'get',
    }),
    chain(validateHttpResponse(url)(t.string)),
    map<string, string>((text) => {
      console.log(`Fetching: ${url} completed`);
      return getReadableDom(text, url);
    })
  );
};
