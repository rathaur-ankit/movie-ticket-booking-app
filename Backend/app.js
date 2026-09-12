import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { urlencoded } from 'express';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './src/utils/inngest.js';
import { showRouter } from './src/routes/show.routes.js';
import { bookingRouter } from './src/routes/booking.routes.js';
import { adminRouter } from './src/routes/admin.routes.js';
import { userRouter } from './src/routes/user.routes.js';
import { stripeWebhooks } from './src/controllers/stripeWebhooks.controllers.js';

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

//Stripe Webhooks Route
app.use('/api/v1/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// routes start from here
app.use('/api/v1/inngest', serve({ client: inngest, functions }));
app.get('/', (req, res) => {
  res.status(200).send('Server is Live');
});

app.use('/api/v1/show', showRouter);
app.use('/api/v1/booking', bookingRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/user', userRouter);

export { app };
