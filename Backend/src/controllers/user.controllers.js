import { Bookings } from '../models/booking.models';

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
