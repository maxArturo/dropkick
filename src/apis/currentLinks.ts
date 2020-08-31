import { FutureInstance } from 'fluture';
import { AppError } from '@app/errors';
import { Link } from '@app/domain';
import { dao } from '@app/adapters/dao/dao';
import { Reader } from 'fp-ts/lib/Reader';
import { Dependencies } from './types';

export function currentLinks(): Reader<Dependencies, FutureInstance<AppError, Array<Link>> {
  return dao((r) => r.links.getLatestLinks);
}
