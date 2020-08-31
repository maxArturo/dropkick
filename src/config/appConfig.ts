import * as t from 'io-ts';
import { validateConfig } from '@app/util';
import { toInt } from '@app/util/functions';

const appConfigCodec = t.type({
  linkFetchInterval: t.number,
  databaseLocation: t.string,
  homeViewLinkCount: t.number,
  linkTextFetchRetryCount: t.number,
  chromiumBinaryPath: t.string,
  port: t.number,
  fetchStrategy: t.keyof({
    browser: null,
    http: null,
  }),
});
export type AppConfigType = t.TypeOf<typeof appConfigCodec>;

export const appConfig: AppConfigType = validateConfig(appConfigCodec, {
  linkFetchInterval: process.env.LINK_FETCH_INTERVAL || 30000,
  databaseLocation: process.env.SQLITE_DB_PATH || 'database/links.db',
  homeViewLinkCount: process.env.HOME_VIEW_LINK_COUNT || 5,
  chromiumBinaryPath: process.env.CHROMIUM_BINARY_PATH || '/usr/bin/chromium-browser',
  linkTextFetchRetryCount: process.env.MAX_FETCH_RETRY_COUNT || 3,
  port: toInt(process.env.PORT || '3000'),
  fetchStrategy: process.env.FETCH_STRATEGY || 'http',
});
