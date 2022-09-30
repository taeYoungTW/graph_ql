import { makeVar, useReactiveVar } from '@apollo/client';

export const timeVar = makeVar(new Date());

export const timeStore = {
    get: () => timeVar(),
    set: (time: Date) => timeVar(time),
    react: () => useReactiveVar(timeVar),
};
