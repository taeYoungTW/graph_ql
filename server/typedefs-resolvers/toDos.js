import { gql } from 'apollo-server';
import { jsonFileFunc } from './_utils.js';

const { getJSON, setJSON } = jsonFileFunc({
    metaUrl: import.meta.url,
    relativePath: '..//jsons/todos.json',
});

const typeDefs = gql`
    type Todo {
        userId: Int
        id: ID
        title: String
        completed: Boolean
    }
`;

const resolvers = {
    Query: {
        toDos: () => getJSON(),
        toDo: (parent, args) => {
            return getJSON().find((todo) => todo.id === +args.id);
        },
    },
    Mutation: {
        deleteTodo: (parent, args, context, info) => {
            let result = null;

            setJSON(
                getJSON().filter((todo) => {
                    const notToDelete = todo.id !== +args.id;
                    if (!notToDelete) {
                        result = todo;
                    }
                    return notToDelete;
                })
            );

            return result;
        },
        insertTodo: (parent, args) => {
            const toDos = getJSON();
            const { userId, id } = toDos[toDos.length - 1];
            const todoToInsert = {
                userId: +userId + 1,
                id: +id + 1,
                ...args,
                completed: false,
            };
            setJSON([...toDos, todoToInsert]);
            return todoToInsert;
        },
        editTodo: (parent, args) => {
            const toDos = getJSON();
            let result = null;
            setJSON(
                toDos.map((todo) => {
                    const isEditToTodo = todo.id === +args.id;
                    if (isEditToTodo) {
                        const editToTodo = {
                            ...todo,
                            ...args,
                            id: +args.id,
                        };
                        result = editToTodo;
                        return editToTodo;
                    }
                    return todo;
                })
            );

            return result;
        },
    },
};

export default { typeDefs, resolvers };
