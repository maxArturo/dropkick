import * as t from 'io-ts';
import { persistableCodec } from './persistable';

export const linkTextCodec = t.intersection([
  t.type({
    id: t.string,
    linkId: t.string,
    linkText: t.string,
  }),
  persistableCodec,
]);

export type LinkText = t.TypeOf<typeof linkTextCodec>;
