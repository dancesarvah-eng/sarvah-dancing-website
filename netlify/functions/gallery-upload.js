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
    try {
        body = JSON.parse(event.body || '{}');
    } catch {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid JSON' }) };
    }

    const { password, title, imageData } = body;

    if (password !== ADMIN_PASSWORD) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Invalid admin password' }) };
    }

    if (!imageData) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'No image data received' }) };
    }

    // Check base64 size — Netlify has 6MB body limit
    const base64Size = (imageData.length * 3) / 4 / 1024 / 1024;
    if (base64Size > 5) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: `Image too large (${base64Size.toFixed(1)}MB). Max 5MB.` }) };
    }

    try {
        const result = await cloudinary.uploader.upload(imageData, {
            folder: 'sarvah-dance-academy/gallery',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        });

        if (title) {
            try {
                await cloudinary.uploader.add_context(
                    `caption=${encodeURIComponent(title)}`,
                    [result.public_id]
                );
            } catch(e) {
                console.warn('Context add failed:', e.message);
            }
        }

        const newImage = {
            id:         result.asset_id,
            url:        result.secure_url,
            public_id:  result.public_id,
            title:      title || 'Sarvah Dance Performance',
            uploadedAt: new Date().toISOString()
        };

        return { statusCode: 200, headers, body: JSON.stringify({ success: true, image: newImage }) };
    } catch (err) {
        console.error('Gallery upload error:', err.message);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ 
                success: false, 
                message: err.message || 'Upload failed'
            }) 
        };
    }
};