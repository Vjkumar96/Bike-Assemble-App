import React, { useState } from 'react';
import axios from 'axios';
import AssembleBike from './AssembleBike';

function App({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const res = await axios.post('http://localhost:5000/login', { username, password });
        setToken(res.data.token);
    };

    return (
        <div>
          <AssembleBike />
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default App;

