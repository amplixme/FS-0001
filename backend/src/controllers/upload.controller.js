const { uploadImage } = require('../services/upload.service');

const upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: {
          message: 'No se envió ninguna imagen',
        },
      });
    }

    const imageUrl = await uploadImage(req.file.buffer);

    return res.status(200).json({
      url: imageUrl,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
};
