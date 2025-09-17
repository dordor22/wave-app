import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import marineRouter from './routes/marine.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/marine', marineRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
