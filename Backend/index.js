import { connectDB } from './src/config/db.js';
import 'dotenv/config';
import { app } from './app.js';

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on the Port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Error occurred while starting the server:', err.message);
    });
}

export default app;
export { app };
