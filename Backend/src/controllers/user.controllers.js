import { clerkClient } from '@clerk/express';
import { Bookings } from '../models/booking.models.js';
import { Movie } from '../models/movie.models.js';

const getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId;
    const bookings = await Bookings.find({ user })
      .populate({
        path: 'show',
        populate: { path: 'movie' },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.json({ succcess: true, message: error.message });
  }
};

const updateFavourite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;
    const user = await clerkClient.users.getUser(userId);
    if (!user.privateMetadata.favourites) user.privateMetadata.favourites = [];

    if (!user.privateMetadata.favourites.includes(movieId)) user.privateMetadata.favourites.push(movieId);
    else {
      user.privateMetadata.favourites = user.privateMetadata.favourites.filter((item) => item !== movieId);
    }

    await clerkClient.users.updateUserMetadata(userId, { privateMetadata: user.privateMetadata });

    res.json({ success: true, message: 'Favorite movies updated' });
  } catch (error) {
    console.error(error);
    res.json({ success: true, message: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);
    const favourites = user.privateMetadata.favourites;
    const movies = await Movie.find({ _id: { $in: favourites } });
    res.json({ success: true, movies });
  } catch (error) {
    console.error(error);
    res.json({ success: true, message: error.message });
  }
};

export { getUserBookings, updateFavourite, getFavorites };
