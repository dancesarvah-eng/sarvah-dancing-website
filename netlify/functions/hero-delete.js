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
    try { body = JSON.parse(event.body || '{}'); }
    catch { return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid JSON' }) }; }
    const { password, public_id } = body;
    if (password !== ADMIN_PASSWORD) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Invalid password' }) };
    }
    if (!public_id) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'No public_id provided' }) };
    }
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        console.log('Deleted hero slide:', public_id, '→', result.result);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    } catch (err) {
        console.error('Hero delete error:', err.message);
        return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: err.message }) };
    }
};