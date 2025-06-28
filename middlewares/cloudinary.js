require("dotenv").config();

const { v2: cloudinaryV2 } = require("cloudinary");
const streamifier = require("streamifier");

cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

function generateUploadURL(image) {
  try {
    const bufferStream = streamifier.createReadStream(image.buffer);

    return new Promise((resolve, reject) => {
      const stream = cloudinaryV2.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            console.error("Upload error:", error);
            reject(error);
          } else {
            const data = {
              uploadUrl: result.secure_url,
              publicId: result.public_id,
            };
            resolve(data);
          }
        }
      );

      bufferStream.pipe(stream);
    });
  } catch (e) {
    console.error("Upload error:", e.message);
    throw new Error(`Error logging in: ${e.message}`);
  }
}

function generateUploadURLs(files) {
  return Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        const bufferStream = streamifier.createReadStream(file.buffer);

        const uploadStream = cloudinaryV2.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              console.error("Upload error:", error);
              reject(error);
            } else {
              resolve({ uploadUrl: result.secure_url });
            }
          }
        );

        bufferStream.pipe(uploadStream);
      });
    })
  );
}

module.exports = {
  generateUploadURL,
  generateUploadURLs,
};
