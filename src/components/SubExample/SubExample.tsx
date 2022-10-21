import { useSubPingSubscription } from '../../generated/graphql';

interface Props {
    a?: string;
}

const SubExample = ({ a }: Props) => {
    const { data, loading } = useSubPingSubscription();
    return (
        <>
            <pre>{JSON.stringify({ data, loading }, null, 2)}</pre>
            <div>SubExample</div>
        </>
    );
};

export default SubExample;
