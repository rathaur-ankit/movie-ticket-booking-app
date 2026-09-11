import express from 'express';
import { protectAdmin } from '../middlewares/auth.middlewares.js';
import { isAdmin } from '../controllers/admin.controllers.js';

const adminRouter = express.Router();

adminRouter.get('/isAdmin', protectAdmin, isAdmin);
adminRouter.get('');
