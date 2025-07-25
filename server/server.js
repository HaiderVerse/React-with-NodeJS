const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

// Routes
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/userdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to MongoDB'));

// Sample data insertion if database is empty
const insertSampleData = async () => {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            const sampleUsers = [
                { name: 'John Doe', email: 'john@example.com', age: 30 },
                { name: 'Jane Smith', email: 'jane@example.com', age: 25 },
                { name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
            ];
            await User.insertMany(sampleUsers);
            console.log('Sample data inserted successfully');
        }
    } catch (error) {
        console.error('Error inserting sample data:', error);
    }
};

insertSampleData();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
