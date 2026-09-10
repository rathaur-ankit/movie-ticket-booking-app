import express from 'express';
import { getNowPlayingMovies } from '../controllers/show.controllers.js';

const showRouter = express.Router();

showRouter.get('/now-playing', getNowPlayingMovies);

export { showRouter };
