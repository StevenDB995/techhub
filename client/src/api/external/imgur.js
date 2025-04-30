import { getImgurAccessToken } from '@/api/services/imgurService';
import axios from 'axios';

const reloadImgurAccessToken = async () => {
  const token = await getImgurAccessToken();
  localStorage.setItem('imgurAccessToken', token);
};

/**
 * Upload image to the Imgur server
 * @param file The image file to be uploaded
 * @returns {Object} Imgur metadata
 * @throws Error App 401 error, app server error or Imgur API error
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', 'file');

  if (!localStorage.getItem('imgurAccessToken')) {
    await reloadImgurAccessToken();
  }

  // retry attempts allowed (including the initial request)
  let attempts = 3;

  while (attempts-- > 0) {
    try {
      const response = await axios.post('https://api.imgur.com/3/image', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('imgurAccessToken')}`
        }
      });

      const { data: imageMetadata } = response.data;
      return imageMetadata;

    } catch (err) {
      // Handle imgur API error
      if (attempts > 0) {
        // Retry
        await reloadImgurAccessToken();
      } else {
        err.source = 'imgur';
        throw err;
      }
    }
  }
};
