import * as t from 'io-ts';

export const persistableCodec = t.type({
  createdAt: t.string,
});
export type Persistable = t.TypeOf<typeof persistableCodec>;
