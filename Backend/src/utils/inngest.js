import { Inngest } from 'inngest';
import { User } from '../models/user.models.js';
import { Bookings } from '../models/booking.models.js';
import { Show } from '../models/show.models.js';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'movie-ticket-booking-app' });

// inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk', triggers: { event: 'clerk/user.created' } },

  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        name: first_name,
        image: image_url,
      };
      await User.create(userData);
    } catch (err) {
      console.log('error occured while creating the user:', err.message);
    }
  }
);

// inngest function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk', triggers: { event: 'clerk/user.deleted' } },
  async ({ event }) => {
    try {
      const { id } = event.data;
      await User.findByIdAndDelete(id);
    } catch (err) {
      console.log('error occured while deleting the user ', err.message);
    }
  }
);

// inngest function to update the user
const syncUserUpdate = inngest.createFunction(
  { id: 'update-user-from-clear', triggers: { event: 'clerk/user.updated' } },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        name: first_name,
        image: image_url,
      };
      await User.findByIdAndUpdate(id, userData);
    } catch (err) {
      console.log('error occured while creating the user:', err.message);
    }
  }
);

// inngest function to cancel booking and release seats of show after 10 minutes of booking created if payment is not made

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  {
    id: 'release-seats-delete-booking',
    triggers: { event: 'app/checkpayment' },
  },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

    await step.run('check-payment-status', async () => {
      const bookingId = event.data.bookingId;
      const booking = await Bookings.findById(bookingId);

      if (!booking.isPaid) {
        const show = await Show.findById(booking.show);
        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedSeats[seat];
        });
        show.markModified('occupiedSeats');
        await show.save();
        await Bookings.findByIdAndDelete(booking._id);
      }
    });
  }
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate, releaseSeatsAndDeleteBooking];
