import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import generatedIntrospection from './generated/graphql';
import { timeStore } from './store/time';

const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache({
        possibleTypes: generatedIntrospection.possibleTypes,
    }),
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>
);
