import { FutureInstance, resolve } from 'fluture';
import { AppError } from '@app/errors';
import { Link } from '@app/domain';

export function currentLinks(): FutureInstance<AppError, Array<Link>> {
  return resolve([]);
}
