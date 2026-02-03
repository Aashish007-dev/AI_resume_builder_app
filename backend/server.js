import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';
import resumeRoutes from './routes/resume.routes.js';


const app = express();
const PORT = process.env.PORT || 3000;
await connectDB();


// Middleware
app.use(cors({withCredentials: true}));
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
