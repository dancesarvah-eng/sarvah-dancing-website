// netlify/functions/gallery-upload.js
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sarvah123';
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ success: false }) };
    }
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid JSON' }) };
    }
    const { password, title, imageData } = body;
    if (password !== ADMIN_PASSWORD) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Invalid password' }) };
    }
    if (!imageData) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'No image data' }) };
    }
    try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(imageData, {
            folder: 'sarvah-dance-academy/gallery',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        });
        const newImage = {
            id: result.asset_id,
            url: result.secure_url,
            public_id: result.public_id,
            title: title || 'Sarvah Dance Performance',
            uploadedAt: new Date().toISOString()
        };
        // Store in Cloudinary context/caption for the title
        if (title) {
            await cloudinary.uploader.add_context({ caption: encodeURIComponent(title) }, result.public_id);
        }
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, image: newImage })
        };
    } catch (err) {
        console.error('Gallery upload error:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: err.message })
        };
    }
};

