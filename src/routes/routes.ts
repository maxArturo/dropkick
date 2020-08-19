import { Route } from './types';
import { resolve, FutureInstance, reject } from 'fluture';
import { AppErrorType, ErrorType } from '@app/errors';
import { apis } from '@app/apis';
import { Link } from '@app/domain';

export const routes: Array<Route<unknown>> = [
  {
    method: 'GET',
    url: '/links',
    handler: (): FutureInstance<AppErrorType, Array<Link>> => apis.currentLinks(),
  },
  {
    method: 'GET',
    url: '/whops',
    handler: (): FutureInstance<AppErrorType, { message: string }> =>
      Math.trunc(Math.random() * 10) % 2 === 0
        ? resolve({ message: 'success' })
        : reject({
            type: ErrorType.default,
            message: '',
            metadata: {},
            errorCode: 500,
          }),
  },
];
