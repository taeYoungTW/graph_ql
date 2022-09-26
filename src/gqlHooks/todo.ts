import { gql, useMutation, useQuery } from '@apollo/client';

/**
 * 아래와 같이 useQuery를 활용하게 되면, 반환될 값에 대한 타입을 지정하여 연결해주어야 하므로 작업이 길어진다.
 * 자동으로 type도 만들어 주는 code gen을 활용하는 것이 좋다.
 */

// Queries
export const GET_TO_DOS = gql`
    query GetToDos {
        toDos {
            completed
            id
            title
            userId
        }
    }
`;

interface ToDo {
    __typename: string;
    completed: boolean;
    id: string;
    title: string;
    userId: number;
}

export const useToDosQuery = () => {
    const result = useQuery<{ toDos: ToDo[] }>(GET_TO_DOS);
    return result;
};

// Mutations
export const ADD_TODO = gql`
    mutation addTodo($title: String) {
        insertTodo(title: $title) {
            completed
            id
            title
            userId
        }
    }
`;

export const useAddTodoMutation = () => {
    const result = useMutation<{
        insertTodo: ToDo;
    }>(ADD_TODO, {
        refetchQueries: [{ query: GET_TO_DOS }],
    });
    return result;
};
