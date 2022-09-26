# 뮤테이션 (Mutations)

참고

-   [GraphQL Korea : 쿼리 & 뮤테이션](https://graphql-kr.github.io/learn/queries/)
-   [GraphQL : Queries and Mutations](https://graphql.org/learn/queries/)

쿼리가 fetch에 대한 것이라면, 서버 측 데이터를 추가, 수정, 삭제 할 수 있도록 하는 요청을 뮤테이션이라고 할 수 있다.

뮤테이션의 과정에서 응답으로 정상적으로 변경된 객체의 새로운 상태를 받는 다면, 받는 객체에 대한 필드를 지정할 수도 있으며 이 또한 중첩 필드를 요청할 수 있다.

하지만, 쿼리의 필드는 병렬로 실행되지만 뮤테이션 필드는 하나씩 차례대로 실행된다.

하나의 요청에서 두개의 같은 두개의 뮤테이션을 보내면 첫번째 요청이 완료되고 두번째 요청이 이루어짐이 보장된다.

## 인라인 프래그먼트 (Inline Fragments)

인터페이스나 유니언 타입을 반환하는 필드를 쿼리하는 경우, 인라인 프래그먼트를 활용해야 한다.
조건에 따라 반환되는 값이 어떤 것이 될지 모르기 떄문에 이에 해당하는 경우에 대한 필드를 구체적으로 작성해주기 위해 프래그먼트를 활용한다.

```gql
# hero 필드의 반환 값은 Character 인터페이스를 반환하기에, interface에 implements된 Droid, Human을 인라인 프래그먼트를 활용하게 된다.
# ... on 타입을 활용하고, Character가 어떤 타입인지에 따라 동작된다.
query HeroForEpisode($ep: Episode!) {
    hero(episode: $ep) {
        name
        ... on Droid {
            primaryFunction
        }
        ... on Human {
            height
        }
    }
}
```

## 메타필드

GraphQL 서비스에서 리턴될 타입을 모르는 상황이 발생하면 클라이언트에서 해당 데이터를 어떤 형식으로 처리할지 모를 수 있는데 `__typename`의 메타 필드를 통해 객체 타입의 이름을 얻을 수 있다.

```gql
{
    search(text: "an") {
        __typename
        ... on Human {
            name
        }
        ... on Droid {
            name
        }
        ... on Starship {
            name
        }
    }
}
```
