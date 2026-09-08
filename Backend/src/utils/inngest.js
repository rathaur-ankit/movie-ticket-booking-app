import { Inngest } from 'inngest';
import { User } from '../models/user.models.js';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'movie-ticket-booking-app' });

// inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name,
      image: image_url,
    };
    await User.create(userData);
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation];
