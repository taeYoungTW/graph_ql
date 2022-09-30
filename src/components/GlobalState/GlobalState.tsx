import { useReactiveVar } from '@apollo/client';
import { useEffect } from 'react';
import { timeStore, timeVar } from '../../store/time';

const GlobalState = () => {
    useEffect(() => {
        return () => {
            timeStore.set(new Date());
        };
    }, []);
    return (
        <>
            <button onClick={() => timeStore.set(new Date())}>Global</button>
            {/* <div>Global {timeStore.time.toLocaleString('ko')}</div> */}
            <ChildState />
        </>
    );
};

const ChildState = () => {
    const time = timeStore.react();
    return (
        <>
            {/* <button onClick={() => setTime(new Date())}>Child</button> */}
            <div> Child : {time.toLocaleString('ko')}</div>
        </>
    );
};

export default GlobalState;
