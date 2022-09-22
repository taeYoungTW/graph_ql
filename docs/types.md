-   참고 : [Graphql korea : 스키마 & 타입](https://graphql-kr.github.io/learn/schema/)

# 타입 시스템

GraphQL 쿼리 언어의 경우 기본적으로 객체의 필드를 지정해야만 한다.
객체의 필드의 타입을 지정 함으로서 받아올 데이터의 형식 예측 및 필요한 데이터를 더잘 표현할 수 있기에 스키마가 필요하다.

쿼리가 들어오면 해당 스키마에 대한 유효성 검사가 된 후 실행된다.

## GraphQL Schema Language

GraphQL은 언어에 얽매이지 않기 위해 독자적인 간단한 언어를 활용한다.
이를 GraphQL schema language라고 한다.

# 객체 타입& 필드

객체 타입 : 서비스에서 가져올 수 있는 객체의 종류와 그 객체의 필드를 나타낸다.

```gql
// 객체 타입
type 객체이름 {
  필드이름: 필드 타입
}

type Character {
  name: String!
  appearsIn: [Episode]!
}
```

# 인자

필드는 0개 이상의 인수를 가질 수 있다.
인자는 모두 이름이 있고, 인자 타입과 인자의 기본값을 지정 할 수 있다.
REST API GET Method에서도 값을 조회하기 위한 인자를 제공하는 경우가 있는데 이에 해당하는 것 같다.

```gql
type Starship {
    id: ID!
    name: String!
    length(unit: LengthUnit = METER): Float
}
```

# 쿼리 & 뮤테이션 타입

-   스키마 대부분이 일반 객체 타입이지만, 스키마 내에는 특수한 타입 쿼리, 뮤테이션 타입이 존재한다.
-   두 타입의 모든 GraphQL 쿼리의 진입점(entry Point)를 나타낸다. (루트 타입)

```gql
type Query {
    hero(episode: Episode): Character
    droid(id: ID!): Droid
}
```

# 스칼라 타입

필드의 구체적인 데이터로 표현되기 위한 쿼리의 끝을 나타낸다.

-   `Int` : 부호가 있는 32비트 정수
-   `Float` : 부호가 있는 부동소수점 값.
-   `String` : UTF-8 문자열.
-   `Boolean` : true 또는 false.
-   `ID` : ID 스칼라 타입은 객체를 다시 요청하거나 캐시의 키로써 자주 사용되는 고유 식별자를 나타냅니다. ID 타입은 String 과 같은 방법으로 직렬화되지만, ID 로 정의하는 것은 사람이 읽을 수 있도록 하는 의도가 아니라는 것을 의미합니다.

## 커스텀 스칼라 타입

스칼라 타입을 만들어, 해당 타입을 직렬화, 역 직력화, 유효성 검사해야 한다는 것을 지정할 수 있습니다.
