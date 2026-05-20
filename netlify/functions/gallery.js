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
        // Fetch all images from the sarvah-dance-academy Cloudinary folder
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'sarvah-dance-academy/',
            max_results: 100,
            context: true  // include metadata like title
        });

        const images = result.resources.map(resource => ({
            id:          resource.public_id,         // used for deletion
            url:         resource.secure_url,
            public_id:   resource.public_id,
            title:       resource.context?.custom?.caption || 'Sarvah Dance Performance',
            uploadedAt:  resource.created_at
        }));

        // Sort newest first
        images.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

        return { statusCode: 200, headers, body: JSON.stringify(images) };
    } catch (err) {
        console.error('Gallery fetch error:', err.message);
        // Return empty array if no images or error
        return { statusCode: 200, headers, body: JSON.stringify([]) };
    }
};
