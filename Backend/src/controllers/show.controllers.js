import { tmdbApi } from '../utils/tmdb.js';
import { Movie } from '../models/movie.models.js';
import { Show } from '../models/show.models.js';
import { Movie } from '../models/movie.models.js';

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

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'movieId is required' });
    }

    let movie = await Movie.findOne({ id: movieId });
    if (!movie) {
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        tmdbApi.get(`/movie/${movieId}`),
        tmdbApi.get(`/movie/${movieId}/credits`),
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
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || '',
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };
      movie = await Movie.create(movieDetails);
    }
    const showsToCreate = [];

    const entries = Array.isArray(showsInput)
      ? showsInput.map((s) => ({ date: s.Date || s.date, times: s.time || s.times || [] }))
      : Object.entries(showsInput).map(([date, times]) => ({ date, times }));

    for (const { date: showDate, times } of entries) {
      for (const time of times) {
        const dateTimeString = `${showDate}T${time}`;
        const parsedDate = new Date(dateTimeString);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: `Invalid date/time: "${dateTimeString}". Expected format: Date="YYYY-MM-DD", time="HH:MM"`,
          });
        }
        showsToCreate.push({
          movie: movieId,
          showDateTime: parsedDate,
          showPrice,
          occupiedSeats: {},
        });
      }
    }
    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }
    res.json({ success: true, message: 'Show Added Successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getShows = async (req, res) => {
  try {
    const shows = (await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie')).toSorted({
      showDateTime: 1,
    });
    const uniqueShows = new Set(shows.map((show) => show.movie));
    res.json({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    console.error('error occured while getting the shows :', error.message);
    res.json({ success: true, message: error.message });
  }
};

const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } });
    const movie = await Movie.findById(movieId);
    const dateTime = {};
    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split('T')[0];
      if (!dateTime[date]) dateTime[date] = [];
      dateTime[date].push({ time: show.showDateTime, showId: show._id });
      res.json({ success: true, movie, dateTime });
    });
  } catch (error) {
    console.error('error occured while getting the show :', error.message);
    res.json({ success: false, message: error.message });
  }
};

export { addShow, getNowPlayingMovies, getShows, getShow };
