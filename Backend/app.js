import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { urlencoded } from 'express';

const app = express();

app.use(cookieParser());
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
