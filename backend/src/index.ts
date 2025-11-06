import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import marineRouter from './routes/marine.js';
import dbTestRouter from './routes/dbtest.js';
import meRouter from './routes/me.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/marine', marineRouter);
app.use('/api/db', dbTestRouter);
app.use('/api', meRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
