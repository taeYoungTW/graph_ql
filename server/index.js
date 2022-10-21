// import { ApolloServer } from '@apollo/server';
import { ApolloServer } from 'apollo-server-express';
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
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { subsTransportWsServer } from './subVersion/subs-transport-ws.js';
import { graphqlWsServer } from './subVersion/graphql-ws.js';

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
const schema = makeExecutableSchema({ typeDefs, resolvers });

const callback = () => {
    ping.publishFunc();
};

await subsTransportWsServer(schema, callback);
// await graphqlWsServer(schema, callback);
