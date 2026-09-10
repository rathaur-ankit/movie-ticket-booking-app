import { tmdbApi } from '../utils/tmdb.js';
import { Movie } from '../models/movie.models.js';
import { Show } from '../models/show.models.js';
import axios from 'axios';

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

const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    let movie = await Movie.findById(movieId);
    if (!movie) {
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);
      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.casts,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || '',
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };
      movie = await Movie.create(movieDetails);
    }
    const showsToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.Date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });
    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }
    res.json({ success: true, message: 'Show Added Successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: err.message });
  }
};
export { addShow, getNowPlayingMovies };
