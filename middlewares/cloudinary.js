import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinaryV2 } from 'cloudinary';
import streamifier from 'streamifier'


cloudinaryV2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET
});



export function generateUploadURL(image) {
    try {
        // Convert the buffer to a readable stream
        const bufferStream = streamifier.createReadStream(image.buffer);

        // Create a promise to resolve the upload result
        return new Promise((resolve, reject) => {
            // Create a stream from the buffer
            const stream = cloudinaryV2.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                if (error) {
                    console.error('Upload error:', error);
                    reject(error); // Reject the promise if there's an error
                } else {
                    const data = { 'uploadUrl': result.secure_url, 'publicId': result.public_id };
                    resolve(data); // Resolve the promise with the upload data
                }
            });


            // Pipe the buffer stream to the Cloudinary upload stream
            bufferStream.pipe(stream);
        })

    } catch(e) {
        console.error('Upload error:', e.message);
        throw new Error(`Error logging in: ${e.message}`);
    }
}



export function generateUploadURLs(files) {
    return Promise.all(files.map((file) => {
        return new Promise((resolve, reject) => {
            const bufferStream = streamifier.createReadStream(file.buffer);

            const uploadStream = cloudinaryV2.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                if (error) {
                    console.error('Upload error:', error);
                    reject(error);
                } else {
                    resolve({ uploadUrl: result.secure_url });
                }
            });

            bufferStream.pipe(uploadStream);
        });
    }));
}