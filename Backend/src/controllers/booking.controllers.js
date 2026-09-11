import { Bookings } from '../models/booking.models.js';
import { Show } from '../models/show.models.js';

const checkSeatAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;
    const occupiedSeats = showData.occupiedSeats;
    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);
    return !isAnySeatTaken;
  } catch (error) {
    console.error('error occrured while check seat availability :', error.message);
    return false;
  }
};

const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    const isAvailable = await checkSeatAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.json({ success: false, message: 'Selected Seats are not available' });
    }
    const showData = await Show.findById(showId).populate('movie');

    const booking = await Bookings.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });
    selectedSeats.map((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified('occupiedSeats');
    await showData.save();

    // Strive payment gateway

    res.json({ success: true, message: 'Booked Successfully' });
  } catch (error) {
    console.log('error occured : ', error.message);
    res.json({ success: false, message: error.message });
  }
};

const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);
    const occupiedSeats = Object.keys(showData.occupiedSeats);
    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.log('error occured : ', error.message);
    res.json({ success: false, message: error.message });
  }
};

export { createBooking, getOccupiedSeats };
