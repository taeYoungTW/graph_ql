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
        video: (_, args) => getJSON().find((item) => item.id === +args.id),
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

/*
// Fragment 활용 예시
query{
  firstVideo: video(id: "1") {
    ...videoFields
  }
  secondVideo: video(id: "2") {
    ...videoFields
  }
}

fragment videoFields on Video {
  episode
  id
  title
}

// 응답
{
  "data": {
    "firstVideo": {
      "episode": "EMPIRE",
      "id": "1",
      "title": "Edit Video"
    },
    "secondVideo": {
      "episode": "EMPIRE",
      "id": "2",
      "title": "ok"
    }
  }
}
*/

export default { typeDefs, resolvers };
