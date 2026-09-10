import express from 'express';
import { protectAdmin } from '../middlewares/auth.middlewares.js';
import { addShow, getNowPlayingMovies, getShow, getShows } from '../controllers/show.controllers.js';

const showRouter = express.Router();

showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies);
showRouter.post('/add', protectAdmin, addShow);
showRouter.get('/all', getShows);
showRouter.get('/:movieId', getShow);

export { showRouter };
