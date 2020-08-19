import { Route, RouteType } from './types';
import { FutureInstance, map, reject, resolve } from 'fluture';
import { AppErrorType, ErrorType } from '@app/errors';
import { FastifyReply } from 'fastify';
import { apis } from '@app/apis';
import { pipe } from 'fp-ts/function';
import { renderer } from '@app/views';
import { Link } from '@app/domain';

export const routes: Array<Route<unknown>> = [
  {
    routeType: RouteType.view,
    method: 'GET',
    url: '/',
    handler: ({ res }: { res: FastifyReply }): FutureInstance<AppErrorType, FastifyReply> => {
      return pipe(
        apis.currentLinks(),
        map<Array<Link>, FastifyReply>((links) => {
          const viewData = renderer.renderHomeView(links);
          return res.view(viewData.templateLocation, viewData.data);
        })
      );
    },
  },
  {
    routeType: RouteType.payload,
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
