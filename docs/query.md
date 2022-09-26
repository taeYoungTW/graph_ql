# 쿼리 (Queries)

참고

-   [GraphQL Korea : 쿼리 & 뮤테이션](https://graphql-kr.github.io/learn/queries/)
-   [GraphQL : Queries and Mutations](https://graphql.org/learn/queries/)

## 필드 (Fields)

가져오고자 하는 객체의 필드를 의미하며, 가져올 필드를 정확히 표시하여 요구하기 때문에 기대한 결과를 얻을 수 있다.
graphQL에 지정한 타입에 따라 응답이 정해져있어, 아래와 같이 `name`은 String, `friends`는 배열과 같은 형태로 응답을 받게 된다.

```gql
# 요청
{
    hero {
        name
        friends {
            name
        }
    }
}
```

```json
// 응답
{
    "data": {
        "hero": {
            "name": "R2-D2",
            "friends": [
                {
                    "name": "Luke Skywalker"
                },
                {
                    "name": "Han Solo"
                },
                {
                    "name": "Leia Organa"
                }
            ]
        }
    }
}
```

## 인자 (Arguments)

객체와 필드를 탐색할 때 인자를 전달함으로서 조금 더 구체적인 정보를 가져올 수 있다.
모든 필드와 중첩된 객체는 인자를 가질 수 있으므로, 한번의 요청으로 여러개의 API fetch를 대체할 수 있게 된다.

```gql
# 요청
{
    human(id: "1000") {
        name
        height(unit: FOOT)
    }
}
```

```json
// 응답
{
    "data": {
        "human": {
            "name": "Luke Skywalker",
            "height": 5.6430448
        }
    }
}
```

## 별칭 (Aliases)

같은 이름의 쿼리에 다른 인자를 넣은 응답을 동시에 가져오고 싶은 경우, 별칭을 활용할 수 있다.

```gql
# 같은 hero 쿼리에 다른 episode 인자를 넣은 결과를 동시에 받고 싶다.
# empireHero, jediHero와 같이 별칭을 붙여 가져올 수 있다.
{
    empireHero: hero(episode: EMPIRE) {
        name
    }
    jediHero: hero(episode: JEDI) {
        name
    }
}
```

```json
{
    "data": {
        "empireHero": {
            "name": "Luke Skywalker"
        },
        "jediHero": {
            "name": "R2-D2"
        }
    }
}
```

## 프래그먼트 (Fragments)

요청하는 객체의 필드가 동일한 경우, 동일한 필드를 계속 작성해야하는 수고가 발생할 수 있다.
이를 위해서, 필드셋을 구성하여 재사용이 가능하게 해주는 프래그먼트를 활용할 수 있다.

-   실행 예시 : enum 파일 예시 쿼리 주석 참고

```gql
# fragment
{
    leftComparison: hero(episode: EMPIRE) {
        ...comparisonFields
    }
    rightComparison: hero(episode: JEDI) {
        ...comparisonFields
    }
}

fragment comparisonFields on Character {
    name
    appearsIn
    friends {
        name
    }
}
```

또한, 쿼리 또는 뮤테이션에 선언된 변수는 프래그먼트에 접근 가능하다.

```gql
query HeroComparison($first: Int = 3) {
    leftComparison: hero(episode: EMPIRE) {
        ...comparisonFields
    }
    rightComparison: hero(episode: JEDI) {
        ...comparisonFields
    }
}

fragment comparisonFields on Character {
    name
    friendsConnection(first: $first) {
        totalCount
        edges {
            node {
                name
            }
        }
    }
}
```

## 작업 이름 (Operation Name)

애플리케이션에서 코드에 이름을 붙여 덜 헷갈리게 작성 할 수 있는데 이를 작업 이름이라고 한다.
작업 타입과 작업 이름이 한쌍을 이룬다고 생각하면 된다.
작업 타입은 쿼리, 뮤테이션, 구독이 될 수 있고, 해당 작업에 적절한 이름을 붙임으로서 디버깅, 서버측 로깅하는데 도움이 된다.

```gql
# 작업 타입 작업 이름 {
query HeroNameAndFriends {
    hero {
        name
        friends {
            name
        }
    }
}
```

## 변수 (Variables)

클라이언트 측의 코드가 인자로 전달 되는 경우 GraphQL의 특정한 포맷으로 직력화가 필요하기 때문에 직접적으로 쿼리 문자열에 전달하는 것은 좋지 않다.
대신 동적 값을 쿼리에서 없애고, 별도로 전달하는 방법을 변수라고 한다.

```gql
query HeroNameAndFriends($episode: Episode = "JEDI") {
    hero(episode: $episode) {
        name
        friends {
            name
        }
    }
}
```

작업

-   쿼리안의 정적인 값을 `$variableName`형태의 변수로 변경
-   쿼리에서 받는 매개변수로 `$variableName`로 설정한다.
-   요청시 JSON 형식으로 `variableName: value`를 작성하여 보낸다.

주의

-   사용자가 제공한 값을 문자열 보간을 활용해서는 안된다.

가능한 값

-   스칼라, 열거형, input, object 타입

필수여부

-   타입 Nullable을 지정하듯 `!`을 활용하여 표기한다.

기본값

-   변수 타입 선언 다음에 기본값을 `=` 으로 명시하여 기본값을 할당할 수 있다.
-   기본값이 할당되었으면, 변수를 제공하지 않아도 쿼리 호출이 가능하다.
-   변수에 값이 제공되면 기본값을 덮어쓴다.

## 지시어

변수를 활용하여 쿼리의 구조와 형태를 동적으로 변경하는 방법시 지시어를 활용할 수 있다.

지시어는 필드나 프래그먼트 안에 삽입될 수 있다.

종류

-   `@include(if: Boolean)` : true인 경우 필드를 결과에 포함
-   `@skip(if: Boolean)` : true이면 필드를 건너뜀

```json
{
    "episode": "JEDI",
    "withFriends": true
}
```

```gql
query Hero($episode: Episode, $withFriends: Boolean!) {
    hero(episode: $episode) {
        name
        friends @include(if: $withFriends) {
            name
        }
    }
}
```

```json
{
    "data": {
        "hero": {
            "name": "R2-D2",
            "friends": [
                {
                    "name": "Luke Skywalker"
                },
                {
                    "name": "Han Solo"
                },
                {
                    "name": "Leia Organa"
                }
            ]
        }
    }
}
```

#### 다음 문서

-   [뮤테이션](./mutation.md)
