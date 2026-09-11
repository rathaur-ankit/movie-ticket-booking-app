import express from 'express';
import { getFavorites, getUserBookings, updateFavourite } from '../controllers/user.controllers.js';

const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings);
userRouter.post('/update-favorite', updateFavourite);
userRouter.get('/favorite', getFavorites);

export { userRouter };
