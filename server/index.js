const app = require('./app');
require('dotenv').config(); // load the .env file

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
