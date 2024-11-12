import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// const login = (username) => {
//   localStorage.setItem("username", username);
// };
// src/App.js

import React, { useState } from 'react';
import Login from './components/login';
import Chat from './components/chat';

const App = () => {
    const [username, setUsername] = useState(null); // Start with null

    const handleLogin = (username) => {
        localStorage.setItem('chaticUsername', username);
        setUsername(username);
    };

    const handleLogout = () => {
        localStorage.removeItem('chaticUsername');
        setUsername(null);
    };

    return (
        <div>
            {username ? (
                <Chat username={username} onLogout={handleLogout} />
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
};

export default App;
