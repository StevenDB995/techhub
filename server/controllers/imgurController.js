const axios = require('axios');
const { dataResponse, messageResponse } = require('../utils/responseUtil');

const {
  IMGUR_CLIENT_ID,
  IMGUR_CLIENT_SECRET,
  IMGUR_REFRESH_TOKEN,
  IMGUR_OAUTH_URL
} = process.env;

exports.getImgurAccessToken = async (req, res) => {
  try {
    const response = await axios.post(IMGUR_OAUTH_URL, new URLSearchParams({
      'refresh_token': IMGUR_REFRESH_TOKEN,
      'client_id': IMGUR_CLIENT_ID,
      'client_secret': IMGUR_CLIENT_SECRET,
      'grant_type': 'refresh_token'
    }));
    return dataResponse(res, 200, response.data);

  } catch (err) {
    // catch axios error
    console.error(err);
    return messageResponse(res, err.data.status, 'Error requesting Imgur access token');
  }
};
