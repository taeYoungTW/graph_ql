- [참고](#참고)
- [소개](#소개)
  - [REST API 한계](#rest-api-한계)
  - [GraphQL](#graphql)
  - [예시](#예시)
  - [특징](#특징)
- [다음 문서](#다음-문서)

# 참고

-   [GraphQL이 등장하기 전 - REST API란? by 얄코](https://www.yalco.kr/@graphql-apollo/1-2/)
-   [GraphQL 소개](https://graphql-kr.github.io/learn/)

# 소개

## REST API 한계

1. 협의된 내용이 아니면 현재 필요하지 않은 정보까지 받게 되어 네트워크 비용 및 시간이 낭비된다. 이를 `OverFetching` 이라고 한다.
2. 필요한 정보가 하나의 REST API가 충족할 수 없어 2개의 요청을 보내 합쳐야 한다. 이를 `UnderFetching` 이라고 한다.

## GraphQL

GraphQL은 API를 위한 쿼리문이며 데이터에 대해 정의한 타입 시스템을 사용하여 쿼리를 실행하기 위한 서버 측 런타임으로
클라이언트에게 요청한 만큼의 데이터를 제공하는데 우선 순위를 둔다.

GraphQL은 어떤 데이터베이스 또는 스토리지 엔진에서도 자유로우며 기존에 존재하는 코드 및 데이터에 의해서만 이루어진다.
개발자가 단일 API 호출로 다양한 데이터 소스에서 데이터를 끌어오는 요청을 구성할 수 있게 한다.

## 예시

아래와 같이 원하는 부분만 query에 넣으면, 요청한 필드 값만 받을 수 있다.

```gql
query Query {
    books {
        id
        author
        title
    }
}
```

```json
{
    "data": {
        "books": [
            {
                "id": "1",
                "author": "Kate Chopin",
                "title": "The Awakening"
            },
            {
                "id": "2",
                "author": "Paul Auster1",
                "title": "City of Glass1"
            },
            {
                "id": "3",
                "author": "Paul Auster2",
                "title": "City of Glass2"
            }
        ]
    }
}
```

```gql
query Query {
    books {
        title
    }
}
```

```json
{
    "data": {
        "books": [
            {
                "title": "The Awakening"
            },
            {
                "title": "City of Glass1"
            },
            {
                "title": "City of Glass2"
            }
        ]
    }
}
```

또한, 아래와 같이 다른 정보와 같이 가져올 수도 있다.

```gql
query Query {
    hello
    books {
        id
        author
        title
    }
}
```

```JSON
{
  "data": {
    "hello": "Hello GraphQL",
    "books": [
      {
        "id": "1",
        "author": "Kate Chopin",
        "title": "The Awakening"
      },
      {
        "id": "2",
        "author": "Paul Auster1",
        "title": "City of Glass1"
      },
      {
        "id": "3",
        "author": "Paul Auster2",
        "title": "City of Glass2"
      }
    ]
  }
}
```

## 특징

1. 필요한 정보들만 선택하여 받아 올 수 있다. (Over fetching 문제해결)
   -> 데이터 전송량 감소

2. 여러 계층의 정보들을 한 번에 받아올 수 있다. (Under fetching 문제해결)
   -> 요청 횟수 감소

3. 하나의 endpoint에서 모든 요청을 처리
   -> 하나의 URI에서 POST로 모든 요청 가능

# 다음 문서

-   [Apollo](./apollo.md)
