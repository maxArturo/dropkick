import * as t from 'io-ts';
import { validateConfig } from '@app/util';

const appConfigCodec = t.type({
  linkFetchInterval: t.number,
  databaseLocation: t.string,
});
export type AppConfigType = t.TypeOf<typeof appConfigCodec>;

export const appConfig: AppConfigType = validateConfig(appConfigCodec, {
  linkFetchInterval: process.env.LINK_FETCH_INTERVAL || 10000,
  databaseLocation: process.env.SQLITE_DB_PATH || 'database/links.db',
});