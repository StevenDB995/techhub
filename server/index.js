const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'development') {
  const dotenv = require('dotenv');
  dotenv.config({ path: '../.env.development' });
}

const app = require('./app');
const connectDB = require('./config/db');

void connectDB();

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
