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
