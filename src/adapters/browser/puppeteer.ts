import puppeteer from 'puppeteer-core';
import { appConfig } from '@app/config';
import { bimap, encaseP } from 'fluture';
import { ErrorType, fromNodeError } from '@app/errors';

const fetch = async (url: string) => {
  console.log(`fetching: ${url}`);
  const browser = await puppeteer.launch({
    executablePath: appConfig.chromiumBinaryPath,
  });
  const page = await browser.newPage();
  await page.goto(url, { timeout: 15000 });
  const text = await page.content();
  await browser.close();

  console.log(`fetching: ${url} finished`);
  return text;
};

export const fetchPage = (url: string) =>
  encaseP(fetch)(url).pipe(bimap(fromNodeError(ErrorType.default))((res) => res));
