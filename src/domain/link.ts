import * as t from 'io-ts';
import { persistableCodec } from './persistable';

export const linkCodec = t.intersection([
  t.type({
    id: t.string,
    title: t.string,
    source: t.string,
    url: t.string,
    commentsUrl: t.string,
    commentsCount: t.number,
  }),
  persistableCodec,
]);

export type Link = t.TypeOf<typeof linkCodec>;
