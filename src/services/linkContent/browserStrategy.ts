import { browser } from '@app/adapters';
import { map } from 'fluture';
import { pipe } from 'fp-ts/lib/function';
import { LinkContentFetcher } from './fetchLinkContent';
import { getReadableDom } from './readability';

export const browserContentFetcher: LinkContentFetcher = (url) =>
  pipe(
    browser.fetchPage(url),
    map<string, string>((text) => getReadableDom(text, url))
  );
