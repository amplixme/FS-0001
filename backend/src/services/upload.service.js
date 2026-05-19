const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const uploadImage = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'fs0001',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result.secure_url);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = {
  uploadImage,
};