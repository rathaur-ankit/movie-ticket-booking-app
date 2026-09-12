import { Bookings } from '../models/booking.models.js';
import { Show } from '../models/show.models.js';
import { Movie } from '../models/movie.models.js';
import stripe from 'stripe';

const checkSeatAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;
    const occupiedSeats = showData.occupiedSeats || {};
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
    const origin =
      req.headers.origin ||
      (req.headers.referer ? new URL(req.headers.referer).origin : null) ||
      process.env.CLIENT_URL ||
      'http://localhost:5173';

    if (!showId || !selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.json({ success: false, message: 'Invalid show or seats selected' });
    }

    const isAvailable = await checkSeatAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.json({ success: false, message: 'Selected Seats are not available' });
    }
    const showData = await Show.findById(showId).populate('movie');
    if (!showData || !showData.movie) {
      return res.json({ success: false, message: 'Show or movie not found' });
    }

    if (!showData.occupiedSeats) {
      showData.occupiedSeats = {};
    }

    const booking = await Bookings.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    selectedSeats.forEach((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified('occupiedSeats');
    await showData.save();

    // Stripe payment gateway
    try {
      const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
      const line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: showData.movie.title,
            },
            unit_amount: Math.round(booking.amount * 100),
          },
          quantity: 1,
        },
      ];
      const session = await stripeInstance.checkout.sessions.create({
        success_url: `${origin}/loading/my-bookings?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/my-bookings`,
        line_items: line_items,
        mode: 'payment',
        metadata: {
          bookingId: booking._id.toString(),
        },
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // expire in 30 min
      });
      booking.paymentLink = session.url;
      await booking.save();
      return res.json({ success: true, url: session.url });
    } catch (stripeError) {
      // Rollback occupied seats and booking if stripe session creation fails
      selectedSeats.forEach((seat) => {
        delete showData.occupiedSeats[seat];
      });
      showData.markModified('occupiedSeats');
      await showData.save();
      await Bookings.findByIdAndDelete(booking._id);
      throw stripeError;
    }
  } catch (error) {
    console.log('error occured : ', error.message);
    res.json({ success: false, message: error.message });
  }
};

const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.json({ success: false, message: 'Session ID is required' });
    }
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid' && session.metadata?.bookingId) {
      await Bookings.findByIdAndUpdate(session.metadata.bookingId, { isPaid: true });
      return res.json({ success: true, message: 'Payment verified successfully' });
    }
    return res.json({ success: false, message: 'Payment not completed' });
  } catch (error) {
    console.error('error verifying session:', error.message);
    return res.json({ success: false, message: error.message });
  }
};

const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);
    if (!showData) {
      return res.json({ success: true, occupiedSeats: [] });
    }
    const occupiedSeats = Object.keys(showData.occupiedSeats || {});
    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.log('error occured : ', error.message);
    res.json({ success: false, message: error.message });
  }
};

export { createBooking, getOccupiedSeats, verifySession };
