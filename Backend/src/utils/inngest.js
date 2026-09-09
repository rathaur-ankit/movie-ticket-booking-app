import { Inngest } from 'inngest';
import { User } from '../models/user.models.js';

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

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];
