import jwt from '@fastify/jwt';
import fastify from 'fastify';
import routes from './routes';

const server = fastify({ logger: true });
server.register(jwt, {
  secret: process.env.JWT_SECRET || '',
  // 有効期限の設定
  // sign: { expiresIn: '10m' },
});
server.register(routes.oretokuSites, { prefix: 'oretoku-sites' });
server.register(routes.oretokuTags, { prefix: 'oretoku-tags' });

server.get('/ping', async (_request, _reply) => {
  return 'pong\n';
});

server.post<{ Body: { username: string; password: string } }>('/login', async (req, reply) => {
  try {
    const { username, password } = req.body;

    const envUserName = process.env.USER_NAME || '';
    const envPassword = process.env.USER_PASSWORD || '';

    if (username !== envUserName || password !== envPassword) {
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
