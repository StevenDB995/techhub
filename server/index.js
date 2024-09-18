const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config(); // load the .env file

const PORT = process.env.PORT || 3000;

void connectDB();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
