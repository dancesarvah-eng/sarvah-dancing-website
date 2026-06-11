const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
};
exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'sarvah-dance-academy/gallery',
            max_results: 100,
            context: true
        });
        const images = (result.resources || []).map(r => ({
            id:         r.asset_id,
            url:        r.secure_url,
            public_id:  r.public_id,
            title:      r.context?.custom?.caption || 'Sarvah Dance Performance',
            uploadedAt: r.created_at
        })).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        return { statusCode: 200, headers, body: JSON.stringify(images) };
    } catch (err) {
        console.error('Gallery fetch error:', err.message);
        return { statusCode: 200, headers, body: JSON.stringify([]) };
    }
};