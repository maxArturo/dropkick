import puppeteer from 'puppeteer-core';
import { appConfig } from '@app/config';
import { bimap, encaseP } from 'fluture';
import { ErrorType, fromNodeError } from '@app/errors';
import { log } from '@app/util/log';

const fetch = async (url: string) => {
  log.info(`fetching: ${url}`);
  const browser = await puppeteer.launch({
    executablePath: appConfig.chromiumBinaryPath,
    args: ['--headless', '--no-sandbox', '--disable-gpu', '--single-process', '--no-zygote'],
  });
  const page = await browser.newPage();
  await page.goto(url, { timeout: 15000 });
  const text = await page.content();
  await browser.close();

  log.info(`fetching: ${url} finished`);
  return text;
};

export const fetchPage = (url: string) =>
  encaseP(fetch)(url).pipe(bimap(fromNodeError(ErrorType.default))((res) => res));
