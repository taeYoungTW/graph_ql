-   [GraphQL 코드 생성기](#graphql-코드-생성기)
    -   [소개](#소개)
    -   [프론트엔드](#프론트엔드)
        -   [수동 작업의 문제 (프론트엔드)](#수동-작업의-문제-프론트엔드)
        -   [자동 생성의 장점 (프론트엔드)](#자동-생성의-장점-프론트엔드)
    -   [백엔드](#백엔드)
    -   [프론트엔드 코드 생성해보기](#프론트엔드-코드-생성해보기)
        -   [설치](#설치)
        -   [설정](#설정)
            -   [설정1: What type of application are you building?](#설정1-what-type-of-application-are-you-building)
            -   [설정2: Where is your schema?](#설정2-where-is-your-schema)
            -   [설정3: Where are your operations and fragments?](#설정3-where-are-your-operations-and-fragments)
            -   [설정4: Pick plugins](#설정4-pick-plugins)
            -   [설정5: Where to write the output](#설정5-where-to-write-the-output)
            -   [설정6: Do you want to generate an introspection file?](#설정6-do-you-want-to-generate-an-introspection-file)
            -   [설정7: How to name the config file?](#설정7-how-to-name-the-config-file)
            -   [설정8: What script in package.json should run the codegen?](#설정8-what-script-in-packagejson-should-run-the-codegen)
    -   [생성된 코드 확인](#생성된-코드-확인)
    -   [다른 방법들](#다른-방법들)
-   [이동](#이동)
    -   [다음 문서](#다음-문서)

# GraphQL 코드 생성기

참고

-   [GraphQL Code Generator: Introduction](https://www.the-guild.dev/graphql/codegen/docs/getting-started)
-   [GraphQL Code Generator: Installation](https://www.the-guild.dev/graphql/codegen/docs/getting-started/installation)

## 소개

GraphQL Code Generator는 GraphQL 스택을 가장 잘 활용할 수 있도록 도와주는 플러그인 기반 도구이다.
백엔드부터 프론트엔드까지 아래의 항목을 자동으로 생성한다.

-   Apollo Client, URQL, React Query 사용 여부 관계 없이 React, Vue, Angular, NextJS, Svelte를 위한 `타입 처리된 쿼리(Queries), 뮤테이션(Mutation), 구독(Subscriptions)`을 제공한다.
-   Nodejs(GraphQL Yoga, GraphQL Module, TypeGraphQL, Apollo) 또는 Java GraphQL server 어떤 것이든, `타입 처리된 GraphQL resolvers`를 제공한다.
-   완전히 타입 처리된 NodeJS SDKs, Apollo Android 등을 지원한다.

위처럼 GraphQL Code Generator는 개발 경험을 향상시킨다.

## 프론트엔드

대부분의 클라이언트에서는 GraphQL Code Generator 없이는 아래처럼 타입을 작성하고 연결해 주는 작업이 필요하다.

```tsx
import { useQuery } from 'urql';

interface PostQuery {
    posts: {
        id: string;
        title: string;
        author?: {
            id: string;
            firstName: string;
            lastName: string;
        };
    }[];
}

const postsQueryDocument = /* GraphQL */ `
    query Posts {
        posts {
            id
            title
            author {
                id
                firstName
                lastName
            }
        }
    }
`;

const Posts = () => {
    const [result] = useQuery<PostQuery>({ query: postsQueryDocument });

    // …
};
```

### 수동 작업의 문제 (프론트엔드)

직접 GraphQL 작업 타입을 관리하거나 타입의 부재는 아래와 같은 많은 이슈를 야기시킨다.

-   옛것이 되어 버린 타입
-   오타
-   데이터의 부분적인 타이핑 (스키마에 해당 타입이 모두 있는 것은 아님)?
    -   수동으로 작성하려면 스키마의 타입이 있는지 잘 봐야 해서?

프론트엔드 어플리케이션 타입들의 강점은 데이터 타입으로 이루어진다. 수동으로 관리되는 데이터 타입들에서 어떤 실수라도 많은 컴포넌트에 영향을 주게 된다.
따라서, GraphQL 작업의 타이핑을 자동으로 생성하는 것은 개발자 경험과 스택의 안정성 둘다 개선시킬 것이다.

### 자동 생성의 장점 (프론트엔드)

이를 통해 프론트엔드 개발자의 이득은 아래와 같다.

-   최신의 타입
-   모든 쿼리, 뮤테이션, 구독, 변수, 결과에 대한 자동 완성
-   적은 보일러플레이트 (React Hooks 처럼 모두 코드가 생성되기 때문)

## 백엔드

대부분의 GraphQL API resolver들은 타입이 없거나, 잘못된 타입으로 남아있어 아래와 같은 문제를 야기한다.

-   Resolver들은 스키마 정의를 준수하지 않는다.
-   Resolver 함수 타입 [시그니처](https://developer.mozilla.org/ko/docs/Glossary/Signature/Function)의 오타

따라서, GraphQL Code Generator는 resolvers의 타입을 자동으로 생성할 수 있도록 도와주는 다수의 플러그인들을 제공한다.

> 이 글에서 백엔드 관련 코드 생성기는 실습하지 않는다. 프론트엔드를 타겟으로 하고 있다.

## 프론트엔드 코드 생성해보기

### 설치

```
npm install graphql
npm install -D @graphql-codegen/cli
```

### 설정

수동 설정과 자동 설정이 존재하는데 이 글에서는 자동 설정을 시도한다.
아래와 같이 실행하면 초기화 마법사가 실행된다.

```
npx graphql-code-generator init
npm install # install the chosen plugins
```

#### 설정1: What type of application are you building?

사용하고자 하는 용도를 선택하면 된다. 백엔드 또는 프론트엔드
프론트엔드라면 React, Stencil, Angular 등을 옵션에서 선택할 수 있다.

```
 npx graphql-code-generator init

    Welcome to GraphQL Code Generator!
    Answer few questions and we will setup everything for you.

? What type of application are you building? (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
>( ) Backend - API or server
 ( ) Application built with Angular
 (*) Application built with React
 ( ) Application built with Stencil
 ( ) Application built with other framework or vanilla JS
```

#### 설정2: Where is your schema?

스키마 위치를 설정한다. path 또는 url을 넣을 수 있는데, 백엔드가 스키마를 파일로 주면 path로 서버가 돌아가고 있으면 서버 url을 넣으면 된다.

이 글에서는 Apollo Sever가 있기 때문에 서버 url인 `http://localhost:4000`으로 설정하였다.

#### 설정3: Where are your operations and fragments?

프론트엔드에서 요청하는 작업을 작성한 Document 위치를 지정해야한다.
Document는 Mutation, Query 등을 작성한 것을 말한다.
이 글에서는 `src/gql` 경로에 존재하는데, Document의 경우 graphql 확장자를 가지기 때문에 기본으로 설정된 `src/**/*.graphql`을 활용해도 문제는 없다.

-   `src/**/*.tsx` 형식으로 설정해서 Operations의 대상을 Tagged Template Literals로 지정할 수도 있다.

```gql
# src/gql/toDo.graphql
query GetToDos {
    toDos {
        completed
        id
        title
        userId
    }
}

mutation addTodo($title: String) {
    insertTodo(title: $title) {
        completed
        id
        title
        userId
    }
}
```

#### 설정4: Pick plugins

```
? Pick plugins: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
>(*) TypeScript (required by other typescript plugins)
 (*) TypeScript Operations (operations and fragments)
 (*) TypeScript React Apollo (typed components and HOCs)
 ( ) TypeScript GraphQL files modules (declarations for .graphql files)
 ( ) TypeScript GraphQL document nodes (embedded GraphQL document)
 ( ) Introspection Fragment Matcher (for Apollo Client)
 ( ) Urql Introspection (for Urql Client)
```

#### 설정5: Where to write the output

-   생성된 코드 파일 경로 및 이름 설정
    -   `src/generated/graphql.tsx`

#### 설정6: Do you want to generate an introspection file?

-   introspection(스키마 확인) 시스템은 어떤 쿼리를 지원하는지에 대한 정보를 요청할 수 있다고 한다.

#### 설정7: How to name the config file?

-   코드 생성기 설정 파일의 이름 설정
    -   `codegen.yml`

#### 설정8: What script in package.json should run the codegen?

-   코드 생성에 대한 스크립트 명령어 설정
    -   `gen`
-   스크립트에 `--watch` 옵션을 붙여주면, 대상 파일이 수정되는 것을 감지해 실행되도록 할 수 있다.

## 생성된 코드 확인

-   `npm run server` & `npm run gen`

-   쿼리

```graphql
query GetToDos {
    toDos {
        completed
        id
        title
        userId
    }
}
```

-   생성된 코드
    -   hook 형태로 코드 생성 및 타입 생성
    -   생성된 hook을 잘보면, option을 추가할 수도 있다.

```tsx
export type GetToDosQuery = {
    __typename?: 'Query';
    toDos: Array<{
        __typename?: 'Todo';
        completed: boolean;
        id: string;
        title: string;
        userId: number;
    }>;
};

/**
 * __useGetToDosQuery__
 *
 * To run a query within a React component, call `useGetToDosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetToDosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetToDosQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetToDosQuery(
    baseOptions?: Apollo.QueryHookOptions<GetToDosQuery, GetToDosQueryVariables>
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetToDosQuery, GetToDosQueryVariables>(
        GetToDosDocument,
        options
    );
}
export function useGetToDosLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<
        GetToDosQuery,
        GetToDosQueryVariables
    >
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetToDosQuery, GetToDosQueryVariables>(
        GetToDosDocument,
        options
    );
}
export type GetToDosQueryHookResult = ReturnType<typeof useGetToDosQuery>;
export type GetToDosLazyQueryHookResult = ReturnType<
    typeof useGetToDosLazyQuery
>;
export type GetToDosQueryResult = Apollo.QueryResult<
    GetToDosQuery,
    GetToDosQueryVariables
>;
export const AddTodoDocument = gql`
    mutation addTodo($title: String) {
        insertTodo(title: $title) {
            completed
            id
            title
            userId
        }
    }
`;
```

-   활용

```tsx
const Example = () => {
    const { data, loading, error } = useGetToDosQuery();
    return <div>{data}</div>;
};
```

## 다른 방법들

-   CLI 환경으로 구동하는 방식이 아닌, VSCode 또는 CRA, Prettier 등.. 과의 통합된 환경을 구성할 수 있다고 한다. (아직 확인해보진 않았다.)
    -   [GraphQL Code Generator : integrations](https://www.the-guild.dev/graphql/codegen/docs/integrations/vscode)

# 이동

## 다음 문서

-   [Operation 작업을 VSCode에 통합시키기](./vscode.md)
