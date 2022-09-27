import { useState } from 'react';
import {
    GetToDosDocument,
    useAddTodoMutation,
    useGetCharactersQuery,
    useGetToDosQuery,
} from '../../generated/graphql';
// import { useToDosQuery, useAddTodoMutation } from '../../gqlHooks/todo';

const Client = () => {
    /**
     * // 직접 hook으로 만든 경우
     * const { error, data, loading } = useToDosQuery();
     */
    // 코드 생성기를 활용한 hook
    const { data, loading, error } = useGetToDosQuery();
    const [isOpenJSON, setIsOpenJSON] = useState(false);
    const { data: _data } = useGetCharactersQuery();
    return (
        <>
            {_data?.characters?.map((character) => (
                <div>{character?.__typename}</div>
            ))}
            <AddTodo />
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                }}
            >
                {loading ? (
                    <div>Loading...</div>
                ) : data ? (
                    <>
                        <div
                            style={{
                                border: '1px solid gray',
                                padding: '10px',
                                borderRadius: '5px',
                            }}
                        >
                            <button
                                onClick={() => {
                                    setIsOpenJSON((prev) => !prev);
                                }}
                                style={{
                                    backgroundColor: 'black',
                                    marginBottom: '10px',
                                    color: 'white',
                                }}
                            >
                                JSON 보기
                            </button>
                            {data.toDos.map((todo) => {
                                const CustomTag = todo.completed
                                    ? 'del'
                                    : 'span';
                                return (
                                    <div
                                        style={{
                                            marginBottom: '10px',
                                            backgroundColor: 'black',
                                            borderRadius: '5px',
                                            padding: '5px',
                                        }}
                                        key={`todoID-${todo.id}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            style={{ marginRight: '10px' }}
                                        />
                                        <CustomTag style={{ color: 'white' }}>
                                            {todo.title}
                                        </CustomTag>
                                    </div>
                                );
                            })}
                        </div>
                        {isOpenJSON && (
                            <pre
                                style={{
                                    border: '1px solid gray',
                                    padding: '10px',
                                    margin: 0,
                                    borderRadius: '5px',
                                }}
                            >
                                <code>
                                    {JSON.stringify(data.toDos, null, 2)}
                                </code>
                            </pre>
                        )}
                    </>
                ) : error ? (
                    <code>{JSON.stringify(error)}</code>
                ) : (
                    <div>??</div>
                )}
            </div>
        </>
    );
};

const AddTodo = () => {
    const [title, setTitle] = useState('');
    /**
     * // 직접 hook으로 만든 경우
     * const [addTodo, { error, data, loading }] = useAddTodoMutation();
     */
    // 코드 생성기를 활용한 hook
    const [addTodo, { error, data, loading }] = useAddTodoMutation({
        refetchQueries: [GetToDosDocument],
        ignoreResults: true,
    });
    return (
        <div>
            <input
                type="text"
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
                style={{ height: '35px' }}
            />
            {loading ? (
                <span>로딩...</span>
            ) : (
                <button
                    style={{
                        backgroundColor: 'black',
                        marginBottom: '10px',
                        color: 'white',
                        marginLeft: '10px',
                    }}
                    onClick={() => title && addTodo({ variables: { title } })}
                >
                    추가
                </button>
            )}
        </div>
    );
};

export default Client;
