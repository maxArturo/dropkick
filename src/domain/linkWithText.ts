import * as t from 'io-ts';
import { linkCodec } from '@app/domain/link';
import { linkDetailsCodec } from '@app/domain/linkText';

export const linkWithTextCodec = t.intersection([linkCodec, linkDetailsCodec]);
export type LinkWithText = t.TypeOf<typeof linkWithTextCodec>;
