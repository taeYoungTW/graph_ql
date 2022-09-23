import { gql } from 'apollo-server';
import { jsonFileFunc } from './_utils.js';

const { getJSON } = jsonFileFunc({
    metaUrl: import.meta.url,
    relativePath: '../jsons/books.json',
});

const typeDefs = gql`
    type Book {
        id: ID
        userId: Int
        title: String
        body: String
    }
`;

const resolvers = {
    Query: {
        books: () => getJSON(),
    },
};

export default { typeDefs, resolvers };
