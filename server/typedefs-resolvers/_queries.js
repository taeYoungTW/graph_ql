import { gql } from 'apollo-server';

const typeDefs = gql`
    type Query {
        books: [Book]
        toDos: [Todo!]!
        toDo(id: ID!): Todo
        date(time: Date!): Dates!
        videos: [Video]
        video(id: ID!): Video
        characters: [Character]
    }
`;

export default typeDefs;
