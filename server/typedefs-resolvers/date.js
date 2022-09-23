import { gql } from 'apollo-server';
import { GraphQLScalarType, Kind } from 'graphql';

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

const typeDefs = gql`
    scalar Date
`;

const resolvers = {
    Date: dateScalar,
    Query: {
        date: (parent, args, context, info) => {
            return `${args.time.toLocaleString('ko')}`;
        },
    },
};

export default { typeDefs, resolvers };
