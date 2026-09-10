import express from 'express';
import { createBooking, getOccupiedSeats } from '../controllers/booking.controllers.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export { bookingRouter };
