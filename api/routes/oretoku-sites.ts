import { type OretokuSites, PrismaClient } from '@prisma/client';
import type { FastifyInstance, FastifyPluginCallback, FastifyRegisterOptions, RegisterOptions } from 'fastify';

const prisma = new PrismaClient();

export const oretokuSites: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts: FastifyRegisterOptions<RegisterOptions>,
  done: (err?: Error | undefined) => void,
) => {
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      if (request.method === 'GET' && request.url === '/oretoku-sites') return;
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  /**
   * 全件取得
   */
  fastify.get('/', async (_request, reply) => {
    try {
      const sites = await prisma.oretokuSites.findMany({ include: { tags: true }, orderBy: { id: 'asc' } });
      reply.send(sites);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  /**
   * idによる取得
   */
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      const site = await prisma.oretokuSites.findUnique({
        where: { id: Number(id) },
        include: { tags: true },
      });
      if (!site) {
        reply.status(404).send({ error: 'Site not found' });
        return;
      }
      reply.send(site);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  /**
   * 新規追加
   */
  fastify.post<{ Body: { oretokuSites: OretokuSites; oretokuTags: { id: number }[] } }>('/', async (request, reply) => {
    try {
      const { name, description, url, imageUrl } = request.body.oretokuSites;
      const oretokuTags = request.body.oretokuTags;

      const newSite = await prisma.oretokuSites.create({
        data: {
          name,
          description,
          url,
          imageUrl,
          tags: { connect: oretokuTags.map((tag) => ({ id: tag.id })) },
        },
      });
      reply.status(201).send(newSite);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  /**
   * 更新
   */
  fastify.put<{ Body: { oretokuSites: OretokuSites; oretokuTags: { id: number }[] } }>('/', async (request, reply) => {
    try {
      const { id, name, description, url, imageUrl } = request.body.oretokuSites;
      const oretokuTags = request.body.oretokuTags;

      const updatedSite = await prisma.oretokuSites.update({
        where: { id },
        data: {
          name,
          description,
          url,
          imageUrl,
          updatedAt: new Date(),
          tags: { set: oretokuTags.map((tag) => ({ id: tag.id })) },
        },
      });
      reply.send(updatedSite);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  /**
   * 削除
   */
  fastify.delete<{ Body: { id: number } }>('/', async (request, reply) => {
    try {
      const { id } = request.body;

      await prisma.oretokuSites.delete({ where: { id } });
      reply.status(204).send();
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  done();
};
