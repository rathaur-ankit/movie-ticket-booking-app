import { connectDB } from './src/config/db.js';
import 'dotenv/config';
import { app } from './app.js';

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on the Port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('error occurred in while starting the server ');
  });
