import express from 'express';
import Subjectrouter from './routes/subjects';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(express.json());

app.use('/api/subjects', Subjectrouter);

app.get('/', (_req, res) => {
  res.send('Hello, Welcome to the class api!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
