import { FutureInstance } from 'fluture';
import { AppError } from '@app/errors';
import { Link } from '@app/domain';
import { dao } from '@app/adapters/dao/dao';

export function currentLinks(): FutureInstance<AppError, Array<Link>> {
  return dao((r) => r.links.getLatestLinks);
}
