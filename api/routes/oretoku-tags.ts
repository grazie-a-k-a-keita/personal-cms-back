import { type OretokuTags, PrismaClient } from '@prisma/client';
import type { FastifyInstance, FastifyPluginCallback, FastifyRegisterOptions, RegisterOptions } from 'fastify';

const prisma = new PrismaClient();

export const oretokuTags: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts: FastifyRegisterOptions<RegisterOptions>,
  done: (err?: Error | undefined) => void,
) => {
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      if (request.method === 'GET' && request.url === '/oretoku-tags') return;
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
      const sites = await prisma.oretokuTags.findMany({ orderBy: [{ isMain: 'desc' }, { id: 'asc' }] });
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
      const site = await prisma.oretokuTags.findUnique({
        where: { id: Number(id) },
      });
      if (!site) {
        reply.status(404).send({ error: 'Tag not found' });
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
  fastify.post<{ Body: OretokuTags }>('/', async (request, reply) => {
    try {
      const { name, imageUrl, isMain } = request.body;

      const newSite = await prisma.oretokuTags.create({
        data: {
          name,
          imageUrl,
          isMain,
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
  fastify.put<{ Body: OretokuTags }>('/', async (request, reply) => {
    try {
      const { id, name, imageUrl, isMain } = request.body;

      const updatedSite = await prisma.oretokuTags.update({
        where: { id },
        data: {
          name,
          imageUrl,
          isMain,
          updatedAt: new Date(),
        },
      });
      reply.send(updatedSite);
    } catch (_error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  /**
   * 削除
   */
  fastify.delete<{ Body: { id: number } }>('/', async (request, reply) => {
    try {
      const { id } = request.body;

      await prisma.oretokuTags.delete({ where: { id } });
      reply.status(204).send();
    } catch (_error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  done();
};
