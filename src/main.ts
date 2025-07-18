import Fastify from 'fastify'
import userRoutes from './contexts/users/infrastructure/fastify/fastify-user-router';
import { initializeServices } from './contexts/shared/infrastructure/ServiceContainer';

const startServer = async () => {
    try {
        console.log('🚀 Starting server initialization...');
        await initializeServices();
        console.log('✅ Services initialized successfully');

        const fastify = Fastify({
            logger: true,
        });

        fastify.register(userRoutes);

        fastify.setErrorHandler((error, _, reply) => {
            reply.status(500).send({ message: error.message });
        });

        const port = Number(process.env.PORT) || 3000;
        const host = process.env.HOST || '0.0.0.0';

        console.log(`🌐 Starting Fastify server on ${host}:${port}...`);
        
        fastify.listen({ port, host }, (err, address) => {
            if (err) {
                console.error('❌ Error starting Fastify server:', err);
                throw err;
            }
            console.log(`🎉 Server is running at ${address}`);
        })

    } catch (error) {
        console.error('💥 Error starting server:', error);
        if (error instanceof Error) {
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        }
        process.exit(1);
    }
}

startServer();