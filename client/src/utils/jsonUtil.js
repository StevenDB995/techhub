export const parseJSON = (str) => {
  try {
    return JSON.parse(str);
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    console.error('Error parsing JSON');
    return null;
  }
};
