import { gql } from 'apollo-server';
import { jsonFileFunc } from './_utils.js';

const { getJSON } = jsonFileFunc({
    metaUrl: import.meta.url,
    relativePath: '../jsons/character.json',
});

const typeDefs = gql`
    interface Character {
        id: ID!
        name: String!
        friends: [String]!
    }

    type Hero implements Character {
        id: ID!
        name: String!
        friends: [String]!
        power: Int!
    }

    type Human implements Character {
        id: ID!
        name: String!
        friends: [String]!
        job: String!
    }
`;

const resolvers = {
    Query: {
        characters: () =>
            getJSON().map((item) => {
                if ('power' in item) {
                    return { ...item, __typename: 'Hero' };
                }
                if ('job' in item) {
                    return { ...item, __typename: 'Human' };
                }
            }),
    },
};

export default { typeDefs, resolvers };
