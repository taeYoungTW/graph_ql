- [Apollo Client (React)](#apollo-client-react)
  - [설치](#설치)
  - [초기화](#초기화)
  - [쿼리 보내기](#쿼리-보내기)
      - [주기적으로 요청 보내기](#주기적으로-요청-보내기)
  - [뮤테이션 보내기](#뮤테이션-보내기)
- [이동](#이동)
  - [다음 문서](#다음-문서)
  - [연관 문서](#연관-문서)

# Apollo Client (React)

참고

-   [ApolloClient: Queries](https://www.apollographql.com/docs/react/data/queries)
-   [Using Apollo with TypeScript](https://www.apollographql.com/docs/react/v2/development-testing/static-typing)

Apollo Client로 React와 통합하여 서버 데이터를 가져오거나 변경을 요청할 수 있다.

## 설치

```
npm install @apollo/client graphql
```

## 초기화

-   모든 곳에서 활용할 수 있도록, ApolloProvider를 아래와 같이 설정한다.

```tsx
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>
);
```

## 쿼리 보내기

사용하고자 하는 컴포넌트에서 apollo/client에서 제공하는 `useQuery`를 활용하면 된다.

-   [ApolloGql : useQuery](https://www.apollographql.com/docs/react/v2/api/react-hooks#usequery)

useQuery에 GraphQL 쿼리 스트링을 넘겨서 호출하면 된다.
컴포넌트가 렌더링 되면 useQuery는 Apollo Client로 부터 UI 표시에 필요한 `loading`, `error`, `data` 속성들이 포함된 객체를 반환한다.

나는 컴포넌트를 복잡하게 만들기 싫어서 custom hook으로 한번더 감싸 외부에서 관리하도록 하였다.

Custom hook으로 만들면서, 어떤 값이 올지 모르기 떄문에 Typescript의 타입을 수동으로 설정해야 한다. ([해당 문제는 코드 생성기를 활용하여 해결 가능하다.](./codegen.md))

인자의 경우 useQuery의 두 번째 인자의 객체 `variables` 속성에 인자를 key로하는 객체를 전달하면 된다.

```ts
import { gql, useQuery } from '@apollo/client';
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

// 쿼리 응답 값에 대한 타입
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
```

```tsx
const Client = () => {
    const { error, data, loading } = useToDosQuery();
    return (
        <div>
            {loading ? (
                'loading...'
            ) : data ? (
                data.toDos.map((todo) => <div>{todo.title}</div>)
            ) : error ? (
                <code>{JSON.stringify(error)}</code>
            ) : (
                '?'
            )}
        </div>
    );
};
```

#### 주기적으로 요청 보내기

graphQL 쿼리 요청을 주기적으로 보낼 수 있다. 폴링 설정을 통해서 요청을 설정 할 수 있다.
설명에는 Option에 [pollInterval](https://www.apollographql.com/docs/react/data/queries/#pollinterval) 속성을 주면 된다고 하는데 동작하지 않았다. 그래서 `startPolling`, `stopPolling` 함수를 받아 실행 시켰더니 동작했다.

```tsx
import { useState } from 'react';
import { useGetDateFromNumberQuery } from '../../generated/graphql';

const _Date = () => {
    const [time, setTime] = useState(new Date().getTime());
    const { data, loading, startPolling, stopPolling } =
        useGetDateFromNumberQuery({
            variables: { time },
            // pollInterval: 1000
        });

    return (
        <>
            <button onClick={() => startPolling(1000)}>Start Polling</button>
            <button onClick={() => stopPolling()}>Stop Polling</button>
            {loading ? (
                'loading...'
            ) : data ? (
                <>
                    <div>보낸 시간 : {data.date.client}</div>
                    <div>서버 시간 : {data.date.server}</div>
                </>
            ) : (
                '?'
            )}
        </>
    );
};

export default _Date;
```

## 뮤테이션 보내기

아래와 같이 뮤테이션 쿼리를 만들고 `useMutation`을 활용한다.
뮤테이션 또한 응답 값이 존재하는 경우 해당 응답에 대한 타입을 지정해주어야 한다.

-   [ApolloGql : useMutation](https://www.apollographql.com/docs/react/v2/api/react-hooks#usemutation)
-   여기에서는 앞전에 사용한 `ToDo`를 재활용하였다.

useMutation의 `refetchQueries`를 지정하여, 뮤테이션이 발생 완료된 후 특정 쿼리를 다시 fetch하게 할 수 있다.

-   여기에서는 컴포넌트에 바로 사용하지 않고, Custom Hook을 만들어 한번 씌워서 사용하였다.
    -   쿼리가 여러 곳에서 활용될 때, 레이어를 만들어 따로 관리하는 것이 한번에 업데이트하기 좋아 보인다.
    -   하지만, 하나의 쿼리가 여러 곳에서 활용될지는 의문이다.
-   여기에서는 투두를 생성 뮤테이션에 투두 리스트를 갱신하는 toDos를 refetch 설정하였다.

```ts
interface ToDo {
    __typename: string;
    completed: boolean;
    id: string;
    title: string;
    userId: number;
}
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
```

아래와 같이 만들어진 hook을 컴포넌트에서 활용한다.

```tsx
const AddTodo = () => {
    const [title, setTitle] = useState('');
    const [addTodo, { error, data, loading }] = useAddTodoMutation();
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
```

<br/>
<br/>

# 이동

## 다음 문서

-   [Code Generator](./codegen.md)

## 연관 문서

-   [GraphQL Types](./types.md)
-   [GraphQL Query](./query.md)
-   [GraphQL Mutation](./mutation.md)
-   [Apollo Client LocalState](./localState.md)
