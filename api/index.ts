import jwt from '@fastify/jwt';
import fastify from 'fastify';
import routes from './routes';

const server = fastify({ logger: true });
server.register(jwt, {
  secret: process.env.JWT_SECRET || '',
  // sign: { expiresIn: '10m' },
});
server.register(routes.oretokuSites, { prefix: 'oretoku-sites' });
server.register(routes.oretokuTags, { prefix: 'oretoku-tags' });

server.get('/ping', async (_request, _reply) => {
  return 'pong\n';
});

server.post<{ Body: { password: string } }>('/get-token', async (req, reply) => {
  try {
    const { password } = req.body;

    if (password !== 'secret') {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const token = server.jwt.sign({});
    reply.send({ token });
  } catch (_error) {
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
