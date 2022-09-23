import { useQuery } from '@apollo/client';
import { gql } from 'apollo-server';

interface Props {
    a?: string;
}

const GET_TO_DOS = gql`
    query {
        toDos {
            completed
            id
            title
            userId
        }
    }
`;

const Client = ({ a }: Props) => {
    const { error, data, loading } = useQuery(GET_TO_DOS);
    return (
        <>
            <div>Client</div>
            {loading ? (
                <div>Loading...</div>
            ) : data ? (
                <div>{data}</div>
            ) : error ? (
                <code>{JSON.stringify(error)}</code>
            ) : (
                <div>??</div>
            )}
        </>
    );
};

export default Client;
