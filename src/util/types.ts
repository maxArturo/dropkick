export function assertNever(value: never): never {
  throw new Error('should not have value: ' + value);
}
