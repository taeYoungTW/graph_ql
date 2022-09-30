import reactLogo from './assets/react.svg';
import './App.css';
import Client from './components/Client';
import _Date from './components/Date';
import GlobalState from './components/GlobalState';
import { useState } from 'react';

function App() {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" className="logo" alt="Vite logo" />
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React + GraphQL(ApolloClient)</h1>
            {isOpen && <GlobalState />}
            <button onClick={() => setIsOpen((prev) => !prev)}>toggle</button>
            <_Date />
            <div className="card">
                <Client />
            </div>
        </div>
    );
}

export default App;
