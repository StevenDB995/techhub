// load the .env file
const dotenv = require('dotenv');

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'production') {
  dotenv.config({ path: '.env' });
} else {
  dotenv.config({ path: '.env.development' });
}

const app = require('./app');
const connectDB = require('./config/db');

void connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
