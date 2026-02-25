import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello, Welcome to the class api!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
