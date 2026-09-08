import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { urlencoded } from 'express';
import { clerkMiddleware } from '@clerk/express';

const app = express();

app.use(cookieParser());
app.use(clerkMiddleware());
app.use(express.json({ limit: '12kb' }));
app.use(express.urlencoded({ extended: true, limit: '12kb' }));
app.use(express.static('public'));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
  })
);

// routes start from here

app.get('/', (req, res) => {
  res.status(200).send('Server is Live');
});

export { app };
