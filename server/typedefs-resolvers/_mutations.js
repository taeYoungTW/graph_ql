import { gql } from 'apollo-server';

const typeDefs = gql`
    type Mutation {
        deleteTodo(id: ID): Todo
        insertTodo(title: String): Todo
        editTodo(id: ID!, userId: Int, title: String, completed: Boolean): Todo
        editVideo(id: ID!, episode: Episode!, title: String): Video
    }
`;

export default typeDefs;
