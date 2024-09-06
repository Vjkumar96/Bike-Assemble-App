import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function Dashboard({ token }) {
    const [data, setData] = useState({ numBikes: 0, employeeProduction: {} });

    const getMetrics = async (fromDate, toDate) => {
        const res = await axios.get(`http://localhost:5000/metrics?fromDate=${fromDate}&toDate=${toDate}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
    };

    useEffect(() => {
        getMetrics('2024-01-01', '2024-12-31'); // Example date range
    }, []);

    return (
        <div>
            <h3>Total Bikes Assembled: {data.numBikes}</h3>
            <Line data={{
                labels: Object.keys(data.employeeProduction),
                datasets: [{
                    label: 'Production per Employee',
                    data: Object.values(data.employeeProduction)
                }]
            }} />
        </div>
    );
}

export default Dashboard;