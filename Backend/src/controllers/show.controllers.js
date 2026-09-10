import { tmdbApi } from '../utils/tmdb.js';

const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await tmdbApi.get('/movie/now_playing');
    const movies = data.results || [];
    return res.status(200).json({
      success: true,
      movies: movies,
    });
  } catch (error) {
    console.error('error occurred while fetching the playing movies :', error.message);
    const statusCode = error.response?.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.response?.data?.status_message || error.message || 'Failed to fetch movies',
    });
  }
};

export { getNowPlayingMovies };
