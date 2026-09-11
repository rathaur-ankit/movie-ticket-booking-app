import express from 'express';
import { protectAdmin } from '../middlewares/auth.middlewares.js';
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from '../controllers/admin.controllers.js';

const adminRouter = express.Router();

adminRouter.get('/isAdmin', protectAdmin, isAdmin);
adminRouter.get('/dashboard', protectAdmin, getDashboardData);
adminRouter.get('/all-shows', protectAdmin, getAllShows);
adminRouter.get('/all-bookings', protectAdmin, getAllBookings);

export { adminRouter };
