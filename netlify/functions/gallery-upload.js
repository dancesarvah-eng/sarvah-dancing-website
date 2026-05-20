const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sarvah123';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ success: false }) };

    let body;
    try { body = JSON.parse(event.body); }
    catch { return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid request body' }) }; }

    const { password, title, imageData } = body;

    // Auth check
    if (password !== ADMIN_PASSWORD) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Invalid admin password' }) };
    }

    if (!imageData) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'No image data received' }) };
    }

    try {
        // Upload base64 image directly to Cloudinary
        const result = await cloudinary.uploader.upload(imageData, {
            folder: 'sarvah-dance-academy',
            context: { caption: title || 'Sarvah Dance Performance' },
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        });

       // To this:
const newImage = {
    id:         Date.now(),  // ✅ Use numeric ID for easier comparison
    url:        result.secure_url,
    public_id:  result.public_id,
    title:      title || 'Sarvah Dance Performance',
    uploadedAt: new Date().toISOString()
};

        console.log(`🖼️ Uploaded to Cloudinary: ${result.secure_url}`);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, image: newImage }) };

    } catch (err) {
        console.error('Cloudinary upload error:', err.message);
        return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Upload failed: ' + err.message }) };
    }
};
