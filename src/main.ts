import fastify from 'fastify';
import compress from 'fastify-compress';
import templateMiddleware from 'point-of-view';
import handlebars from 'handlebars';

import { applyRoutes } from './routes';
import { linksService } from '@app/services';
import { appConfig } from './config';

const app = fastify({ logger: true });

app.register(compress);
app.register(templateMiddleware, { engine: { handlebars } });

applyRoutes(app);

app.listen(appConfig.port, '0.0.0.0', (err) => {
  if (err) {
    throw err;
  }

  linksService.scheduleFetchLinks();
});
