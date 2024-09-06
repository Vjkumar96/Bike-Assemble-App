import React, { useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';

function AssembleBike({ token }) {
    const [bikeId, setBikeId] = useState(1);

    const assemble = async () => {
        await axios.post('http://localhost:5000/assemble', { bikeId, employeeId: 1 }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    };

    return (
        <div>
            <Dashboard />
            <select onChange={(e) => setBikeId(e.target.value)}>
                <option value={1}>Bike 1</option>
                <option value={2}>Bike 2</option>
                <option value={3}>Bike 3</option>
            </select>
            <button onClick={assemble}>Assemble</button>
        </div>
    );
}

export default AssembleBike;