import { ApolloServer } from '@apollo/server';
import queries from './typedefs-resolvers/_queries.js';
import mutation from './typedefs-resolvers/_mutations.js';
import books from './typedefs-resolvers/books.js';
import toDos from './typedefs-resolvers/toDos.js';
import date from './typedefs-resolvers/date.js';
import ping from './typedefs-resolvers/subscription.js';
import _enum from './typedefs-resolvers/enum.js';
import _interface from './typedefs-resolvers/interface.js';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';

const typeDefs = [
    queries,
    mutation,
    books.typeDefs,
    toDos.typeDefs,
    date.typeDefs,
    ping.typeDefs,
    _enum.typeDefs,
    _interface.typeDefs,
];

const resolvers = [
    books.resolvers,
    toDos.resolvers,
    date.resolvers,
    ping.resolvers,
    _enum.resolvers,
    _interface.resolvers,
];
const app = express();
const httpServer = createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });
// Creating the WebSocket server
const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);
const server = new ApolloServer({
    schema,
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});

ping.publishFunc();

await server.start();
app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server));

const PORT = 4000;
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});
