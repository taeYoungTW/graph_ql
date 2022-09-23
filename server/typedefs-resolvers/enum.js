import { gql } from 'apollo-server';
import { jsonFileFunc } from './_utils.js';

const { getJSON, setJSON } = jsonFileFunc({
    metaUrl: import.meta.url,
    relativePath: '../jsons/enum.json',
});

const typeDefs = gql`
    enum Episode {
        NEWHOPE
        EMPIRE
        JEDI
    }
    type Video {
        id: ID!
        title: String
        episode: Episode!
    }
`;

const resolvers = {
    Query: {
        videos: () => getJSON(),
    },
    Mutation: {
        editVideo: (_, args) => {
            let result;
            setJSON(
                getJSON().map((item) => {
                    if (item.id === +args.id) {
                        const newItem = { ...item, ...args, id: +args.id };
                        result = newItem;
                        return newItem;
                    }
                    return item;
                })
            );
            return result;
        },
    },
};

export default { typeDefs, resolvers };
