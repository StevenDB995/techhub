export const getDateString = (isoDateString) => {
  return new Date(isoDateString).toLocaleDateString('en-AU');
}
