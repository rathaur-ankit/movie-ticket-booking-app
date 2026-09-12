import { Inngest } from 'inngest';
import { User } from '../models/user.models.js';
import { Bookings } from '../models/booking.models.js';
import { Show } from '../models/show.models.js';
import { sendEmail } from './nodeMailer.js';

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

// inngest function to send email to user on successfull booking
const sendBookingConfirmationEmail = inngest.createFunction(
  {
    id: 'release-seats-delete-booking',
    triggers: { event: 'app/checkpayment' },
  },
  async ({ event, step }) => {
    const { bookingId } = event.data;
    const booking = await Bookings.findById(bookingId)
      .populate({
        path: 'show',
        populate: { path: 'movie', model: 'Movie' },
      })
      .populate('user');

    await sendEmail({
      to: booking.user.email,
      subject: `Payment Confirmation :"${booking.show.movie.title}" booked!`,
      body: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h2>Hi ${booking.user.name},</h2>
    <p>Your booking for <strong style="color: #F84565;">"${booking.show.movie.title}"</strong> is confirmed.</p>
    <p>
      <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
      <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}
    </p>
    <p>Enjoy the show! 🍿</p>
    <p>Thanks for booking with us!<br/>- QuickShow Team</p>
  </div>`,
    });
  }
);

//inngest function to send remiders
const sendShowReminders = inngest.createFunction({
  id: 'send-show-reminders',
  triggers: { cron:"0 */8 * * *" },
  async ({step}) => {
    const now=new Date();
    const in8Hours=new Date(now.getTime()+8*60*60*1000);
    const windowStart=new Date(in8Hours.getTime()-10*60*1000);

    const reminderTasks = await step.run('prepare-reminder-tasks', async () => {
      const shows = await Show.find({
        showDateTime: { $gte: windowStart, $lte: in8Hours },
      }).populate('movie');

      const tasks = [];
      for (const show of shows) {
        if (!show.movie || !show.occupiedSeats) continue;
        const userIds = [...new Set(Object.values(show.occupiedSeats))];
        if (userIds.length === 0) continue;
        const users = await User.find({ _id: { $in: userIds } }).select('name email');

        for (const user of users) {
          tasks.push({
            userEmail:user.email,
            userName:user.name,
            movieTitle:show.movie.title,
            showTime:show.showTime,
          })
        }
      }
      return tasks;
    });

    if (reminderTasks.length === 0) {
      return { sent: 0, message: 'No reminders to send.' };
    }

    const results = await step.run('send-all-reminders', async () => {
      return await Promise.allSettled(
        reminderTasks.map((task) =>
          sendEmail({
            to: task.userEmail,
            subject: `Reminder: Your movie "${task.movieTitle}" starts soon!`,
            body: `<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Hello ${task.userName},</h2>
    <p>This is a quick reminder that your movie:</p>
    <h3 style="color: #F84565;">"${task.movieTitle}"</h3>
    <p>
      is scheduled for <strong>${new Date(task.showTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}</strong> at
      <strong>${new Date(task.showTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}</strong>.
    </p>
    <p>It starts in approximately <strong>8 hours</strong> - make sure you're ready!</p>
    <br/>
    <p>Enjoy the show!<br/>QuickShow Team</p>
  </div>`
      })))
    })
    const sent =results.filer(r=>r.status==="fulfilled").length;
    const failed=results.length-sent;
    return {
      sent,
      failed,
      message:`Send ${sent} reminder(s), ${failed} failed.`
    }
  }
});

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendShowReminders
];
