import { FastifyInstance } from 'fastify';
import { forkCatch } from 'fluture';
import { Route, RouteType } from './types';
import { AppError } from '@app/errors';
import { routes } from './routes';
import { assertNever } from '@app/util/types';

function mapRoute<A>(route: Route<A>, app: FastifyInstance): void {
  app.route({
    method: route.method,
    url: route.url,
    handler: (req, res) => {
      const handler = route.handler({
        body: req.body,
        params: req.params,
        queryParams: req.query,
        req,
        res,
      });

      const handleError = (e: Error) => {
        app.log.error(e.message, { ...e });
        res.status(500).send('Internal server error, see logs for details');
      };
      const handleReject = (err: AppError) => res.status(err.errorCode).send({ ...err });

      switch (route.routeType) {
        case RouteType.payload:
          forkCatch(handleError)(handleReject)((payload) => res.code(200).send(payload))(handler);
          return void 0;
        case RouteType.view:
          forkCatch(handleError)(handleReject)(() => res.code(200))(handler);
          return void 0;
        default:
          return assertNever(route.routeType);
      }
    },
  });
}

export function applyRoutes(app: FastifyInstance): void {
  routes.map((r) => mapRoute(r, app));
}
