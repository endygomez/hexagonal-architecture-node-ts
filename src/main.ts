import Fastify from 'fastify'
import userRoutes from './contexts/users/infrastructure/fastify/fastify-user-router';


const fastify = Fastify({
    logger: true,
});


fastify.register(userRoutes);

fastify.setErrorHandler((error, _, reply) => {
    reply.status(500).send({ message: error.message });
});


fastify.listen({ port: 3000 }, (err, _) => {
    if (err) throw err;
})