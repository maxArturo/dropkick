import { FastifyInstance } from 'fastify';
import { forkCatch } from 'fluture';
import { Route } from './types';
import { AppErrorType } from '@app/errors';
import { routes } from './routes';

function mapRoute<A>(route: Route<A>, app: FastifyInstance): void {
  app.route({
    method: route.method,
    url: route.url,
    handler: (req, res) => {
      const handler = route.handler({ body: req.body, params: req.params, queryParams: req.query });

      forkCatch((e) => {
        app.log.error(e.message, { ...e });
        res.status(500).send('Internal server error, see logs for details');
      })((err: AppErrorType) => res.status(err.errorCode).send({ ...err }))((payload) =>
        res.code(200).send(payload)
      )(handler);
    },
  });
}

export function applyRoutes(app: FastifyInstance): void {
  routes.map((r) => mapRoute(r, app));
}
