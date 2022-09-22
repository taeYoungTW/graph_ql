import { ApolloServer, gql } from 'apollo-server';
import { readFileSync } from 'fs';
import { join } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import { GraphQLScalarType, Kind, parseValue } from 'graphql';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hello = 'Hello GraphQL';

/**
 * @see https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/
 */
const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    // 외부에서 활용할 수 있게 직렬화 (서버 -> 클라)
    serialize(value) {
        return value.getTime();
    },
    // 변수를 통해 전달된 값을 내부 서버에서 활용할 수 있게 역 직렬화 (클라 -> 서버)
    parseValue(value) {
        return new Date(value);
    },
    // 쿼리를 통해 전달된 값을 내부 서버에서 활용할 수 있게 역 직렬화 (클라 -> 서버)
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10));
        }
        return null;
    },
});

/**
 * typeDef
 * GraphQL 명세에서 사용될 데이터, 요청의 타입 지정
 * gql(template literal tag)로 생성됨
 */
const typeDefs = gql`
    # 커스텀 스칼라 타입
    scalar Date

    type Book {
        id: ID
        userId: Int
        title: String
        body: String
    }
    type Todo {
        userId: Int
        id: ID
        title: String
        completed: Boolean
    }

    type Query {
        books: [Book]
        toDos: [Todo]
        hello: String
        date(time: Date): String
    }
`;

const resolvers = {
    Date: dateScalar,
    Query: {
        books: () => {
            return JSON.parse(
                readFileSync(join(__dirname, './books.json')).toString()
            );
        },
        hello: () => hello,
        toDos: () =>
            JSON.parse(
                readFileSync(join(__dirname, './todos.json')).toString()
            ),
        date: (_, args) => {
            console.dir(args, { depth: null });
            // parseValue를 통해서
            return `${args.time.toLocaleString('ko')}`;
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
