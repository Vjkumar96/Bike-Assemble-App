const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const port = 5000;


mongoose.connect('mongodb://localhost/bikeAssemblyApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const employees = [
    { id: 1, username: 'employee1', password: bcrypt.hashSync('password1', 8) },
    { id: 2, username: 'employee2', password: bcrypt.hashSync('password2', 8) },
    { id: 3, username: 'employee3', password: bcrypt.hashSync('password3', 8) },
    { id: 4, username: 'employee4', password: bcrypt.hashSync('password4', 8) },
    { id: 5, username: 'employee5', password: bcrypt.hashSync('password5', 8) }
];


const bikes = [
    { id: 1, name: 'Bike 1', timeToAssemble: 50 }, 
    { id: 2, name: 'Bike 2', timeToAssemble: 60 },
    { id: 3, name: 'Bike 3', timeToAssemble: 80 }
];


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const employee = employees.find(e => e.username === username);

    if (!employee || !bcrypt.compareSync(password, employee.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: employee.id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
});


app.post('/assemble', (req, res) => {
    const { bikeId, employeeId } = req.body;

    const bike = bikes.find(b => b.id === bikeId);
    if (!bike) return res.status(404).json({ message: 'Bike not found' });

    
    const assembly = new Assembly({ employeeId, bikeId, timeTaken: bike.timeToAssemble, date: new Date() });
    assembly.save()
        .then(() => res.json({ message: 'Bike assembly recorded' }))
        .catch(err => res.status(500).json({ message: 'Error saving record' }));
});

app.get('/metrics', (req, res) => {
    const { fromDate, toDate } = req.query;

    Assembly.find({
        date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
    }).then(assemblies => {
        const numBikes = assemblies.length;

        const employeeProduction = assemblies.reduce((acc, curr) => {
            acc[curr.employeeId] = (acc[curr.employeeId] || 0) + 1;
            return acc;
        }, {});

        res.json({ numBikes, employeeProduction });
    }).catch(err => res.status(500).json({ message: 'Error fetching metrics' }));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});