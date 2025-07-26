// Load environment variables
import './bootstrap/env.js';
// Start app
import app from './bootstrap/app.js';
import connectDB from './bootstrap/db.js';

const { NODE_ENV, SERVER_PORT } = process.env;

await connectDB();

const PORT = SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
