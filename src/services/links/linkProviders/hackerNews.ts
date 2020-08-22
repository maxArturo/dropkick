import { chain, FutureInstance, map } from 'fluture';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';
import { http } from '@app/adapters';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { validateHttpResponse } from '@app/util/validators';
import { AppError } from '@app/errors';
import { Link } from '@app/domain';

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

const fetchLinks = (): FutureInstance<AppError, Array<Link>> =>
  pipe(
    http({ url: HACKER_NEWS_URL, method: 'get' }),
    chain(validateHttpResponse(HACKER_NEWS_URL)(hackerNewsResponse)),
    map((response: HackerNewsResponse) => {
      return response.hits.map((hit) => ({
        id: uuid(),
        title: hit.title,
        url: hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
        source: 'hackerNews',
        commentsUrl: `https://news.ycombinator.com/item?id=${hit.objectID}`,
        commentsCount: hit.num_comments,
        createdAt: DateTime.local().toISO() ?? '',
      }));
    })
  );

export const hackerNews = { fetchLinks };
