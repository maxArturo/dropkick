import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Readability } = require('mozilla-readability');

export function getReadableDom(text: string, url: string): string {
  const window = new JSDOM('').window;
  const domPurify = createDOMPurify((window as unknown) as Window);
  const cleanText = domPurify.sanitize(text);

  const doc = new JSDOM(cleanText, { url });

  const reader = new Readability(doc.window.document);
  const article = reader.parse();
  return article?.content ?? '';
}
