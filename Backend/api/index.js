import { app } from '../app.js';
import { connectDB } from '../src/config/db.js';

// Pre-warm database connection on cold start
connectDB().catch((err) => {
  console.error('Cold-start DB connection attempt failed:', err.message);
});

export default app;

