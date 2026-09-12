import express from 'express';
import { createBooking, getOccupiedSeats, verifySession } from '../controllers/booking.controllers.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking);
bookingRouter.post('/verify-session', verifySession);
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export { bookingRouter };
