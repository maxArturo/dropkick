import fastify from 'fastify';
import compress from 'fastify-compress';
import templateMiddleware from 'point-of-view';
import handlebars from 'handlebars';

import { applyRoutes } from './routes';
import { linksService } from '@app/services';

const app = fastify({ logger: true });

app.register(compress);
app.register(templateMiddleware, { engine: { handlebars } });

applyRoutes(app);

app.listen(3000, (err) => {
  if (err) {
    throw err;
  }

  linksService.scheduleLinkExtraction();
});
