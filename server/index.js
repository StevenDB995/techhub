// Load environment variables
const path = require('path');
const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'development') {
  const dotenv = require('dotenv');
  dotenv.config({ path: path.resolve(__dirname, '../.env.development') });
}

// Start app
const app = require('./app');
const connectDB = require('./bootstrap/db');

void connectDB();

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
