import camelCase from 'camelcase';
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop(): void {}

export function camelCaseKeys(input: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  Object.keys(input).map((key) => {
    const camelizedKey = camelCase(key);
    result[camelizedKey] = input[key];
  });
  return result;
}
