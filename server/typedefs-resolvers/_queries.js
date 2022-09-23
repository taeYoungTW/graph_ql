import { gql } from 'apollo-server';

const typeDefs = gql`
    type Query {
        books: [Book]
        toDos: [Todo]
        toDo(id: ID!): Todo
        date(time: Date): String
        videos: [Video]
    }
`;

export default typeDefs;
