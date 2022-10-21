import { gql } from 'apollo-server';
import { PubSub } from 'graphql-subscriptions';

const typeDefs = gql`
    type Subscription {
        messageAdded: String
    }
`;

const pubsub = new PubSub();
const resolvers = {
    Query: {
        ping: () => 'pong',
    },
    Subscription: {
        messageAdded: {
            subscribe: () => pubsub.asyncIterator(['messageAdded']),
        },
    },
};

const publishFunc = () =>
    setInterval(() => {
        pubsub.publish('messageAdded', {
            messageAdded: new Date().toLocaleString('ko'),
        });
    }, 2000);

export default { typeDefs, resolvers, publishFunc };
