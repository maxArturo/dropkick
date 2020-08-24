import * as t from 'io-ts';
import { persistableCodec } from './persistable';

export const linkDetailsCodec = t.type({
  linkText: t.union([t.string, t.null]),
  retryCount: t.number,
});

export const linkTextCodec = t.intersection([
  t.type({
    id: t.string,
    linkId: t.string,
  }),
  linkDetailsCodec,
  persistableCodec,
]);

export type LinkText = t.TypeOf<typeof linkTextCodec>;
