import fastify from 'fastify';

const app = fastify({ logger: true });

app.get('/', (_res, res) => {
  res.send({ hello: 'world' });
});

app.listen(3000, (err, address) => {
  if (err) {
    throw err;
  }
  app.log.info(`server listening on ${address}`);
});
