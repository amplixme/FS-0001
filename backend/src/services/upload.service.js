import { createReadStream } from 'streamifier';
import { uploader } from '../config/cloudinary';

const uploadImage = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = uploader.upload_stream(
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

    createReadStream(fileBuffer).pipe(stream);
  });
};

export default {
  uploadImage,
};