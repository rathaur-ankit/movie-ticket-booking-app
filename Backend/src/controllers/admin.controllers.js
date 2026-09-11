import { Bookings } from '../models/booking.models.js';
import { Show } from '../models/show.models.js';
import { User } from '../models/user.models.js';

const isAdmin = async (req, res) => {
  res.json({ success: true, isAdmin: true });
};

const getDashboardData = async (req, res) => {
  try {
    const bookings = await Bookings.find({ isPaid: true });
    const activeShows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie');
    const totalUser = await User.countDocuments();

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser,
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { isAdmin };
