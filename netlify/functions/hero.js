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
// These reference images already in your /public/sarvah/photos/ folder
const DEFAULTS = [
    { id: 'default-1', url: '/sarvah/photos/IMG_0512.JPEG', title: 'Traditional Bharatanatyam Performance', isDefault: true, uploadedAt: new Date().toISOString() },
    { id: 'default-2', url: '/sarvah/photos/IMG_0511.JPEG', title: 'Sarvah Dance Academy', isDefault: true, uploadedAt: new Date().toISOString() }
];
exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'sarvah-dance-academy/hero',
            max_results: 30,
            resource_type: 'image'
        });
        const customSlides = (result.resources || []).map(r => ({
            id:         r.asset_id,
            url:        r.secure_url,
            public_id:  r.public_id,
            title:      'Hero Image',
            uploadedAt: r.created_at,
            isDefault:  false
        }));
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify([...DEFAULTS, ...customSlides])
        };
    } catch (err) {
        console.error('Hero GET error:', err.message);
        // Return just defaults if Cloudinary fails
        return { statusCode: 200, headers, body: JSON.stringify(DEFAULTS) };
    }
};