import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import express from 'express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

export const subsTransportWsServer = async (schema, callback) => {
    const app = express();
    const httpServer = createServer(app);

    const PORT = 4000;
    httpServer.listen(PORT, () => {
        console.log(
            `Server is now running on http://localhost:${PORT}/graphql`
        );
    });

    const subscriptionServer = SubscriptionServer.create(
        {
            schema,
            execute,
            subscribe,
        },
        {
            server: httpServer,
            path: '/graphql',
        }
    );

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            subscriptionServer.close();
                        },
                    };
                },
            },
        ],
    });

    await server.start();
    server.applyMiddleware({ app });
    callback();
};
