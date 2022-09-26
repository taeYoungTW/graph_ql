import { useState } from 'react';
import { useGetDateFromNumberQuery } from '../../generated/graphql';

const _Date = () => {
    const [time, setTime] = useState(new Date().getTime());
    const { data, loading, startPolling, stopPolling } =
        useGetDateFromNumberQuery({
            variables: { time },
        });

    return (
        <>
            <button onClick={() => startPolling(1000)}>Start Polling</button>
            <button onClick={() => stopPolling()}>Stop Polling</button>
            {loading ? (
                'loading...'
            ) : data ? (
                <>
                    <div>보낸 시각 : {data.date.client}</div>
                    <div>서버 시간 : {data.date.server}</div>
                </>
            ) : (
                '?'
            )}
        </>
    );
};

export default _Date;
