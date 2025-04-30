const axios = require('axios');

const deleteImage = async (deletehash) => {
  return await axios.delete(`https://api.imgur.com/3/image/${deletehash}`, {
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
    }
  });
};

module.exports = {
  deleteImage
};
