import { FutureInstance } from 'fluture';
import { AppErrorType } from '@app/errors';
import { Link } from '@app/domain';
import { fetchLinks } from '@app/services';

export function currentLinks(): FutureInstance<AppErrorType, Array<Link>> {
  return fetchLinks();
}
