import { chain, map } from 'fluture';
import { DateTime } from 'luxon';
import { http } from '@app/adapters/http';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { validateHttpResponse } from '@app/util/validators';

const HACKER_NEWS_URL = 'https://hn.algolia.com/api/v1/search?tags=front_page';

const hackerNewsResponse = t.type({
  hits: t.array(
    t.type({
      title: t.string,
      url: t.union([t.string, t.null]),
      num_comments: t.number,
      objectID: t.string,
    })
  ),
});
type HackerNewsResponse = t.TypeOf<typeof hackerNewsResponse>;

const fetchLinks = () =>
  pipe(
    http({ url: HACKER_NEWS_URL, method: 'get' }),
    chain(validateHttpResponse(HACKER_NEWS_URL)(hackerNewsResponse)),
    map((response: HackerNewsResponse) => {
      return response.hits.map((hit) => ({
        title: hit.title,
        url: hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
        source: 'hackerNews',
        commentsUrl: `https://news.ycombinator.com/item?id=${hit.objectID}`,
        commentsCount: hit.num_comments,
        createdAt: DateTime.local().toHTTP(),
        createdBy: 'system',
      }));
    })
  );

export const hackerNews = { fetchLinks };
