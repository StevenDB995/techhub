export const validateFileType = (file, allowedFileTypes) => {
  return allowedFileTypes.includes(file.type);
};

export const validateFileSize = (file, maxSizeInMB) => {
  const maxSize = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSize;
};
