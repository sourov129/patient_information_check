const connectToMongo = require('./config/db');

// Connect to the database
connectToMongo();


const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors'); // Import cors

app.use(cors()); // Enable CORS

//middleware to  see the req.body object
app.use(express.json());



//Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/patient', require('./routes/patientinfo'))



app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// app.get('/api/v1/login', (req, res) => {
//     res.send('halum');
// });







app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});