import { FastifyInstance } from 'fastify';
import { FastifyUserController } from './fastify-user-controller';


export default async function userRoutes(fastify: FastifyInstance) {
  const controller = new FastifyUserController();

  fastify.get('/users', controller.findAll);
  fastify.get('/users/:id', controller.findOneById);
  fastify.post('/users', controller.create);
  fastify.patch('/users/:id', controller.update);
  fastify.delete('/users/:id', controller.delete);
}
