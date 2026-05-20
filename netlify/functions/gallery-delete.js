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
    console.log('🔵 DELETE FUNCTION CALLED');
    console.log('HTTP Method:', event.httpMethod);
    console.log('Headers:', JSON.stringify(event.headers));
    
    if (event.httpMethod === 'OPTIONS') {
        console.log('🟡 Handling OPTIONS preflight');
        return { statusCode: 200, headers, body: '' };
    }

    console.log('Raw event body:', event.body);
    
    let body;
    try { 
        body = JSON.parse(event.body || '{}');
        console.log('✅ Parsed body:', JSON.stringify(body));
    } catch(e) { 
        console.error('❌ Failed to parse JSON:', e.message);
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid JSON' }) };
    }

    const { password, id } = body;
    console.log('📝 Received password:', password ? '***' : 'MISSING');
    console.log('📝 Received id:', id);
    console.log('📝 Expected password:', ADMIN_PASSWORD);

    if (password !== ADMIN_PASSWORD) {
        console.log('❌ Password mismatch');
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Invalid password' }) };
    }

    if (!id) {
        console.log('❌ No ID provided');
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'No image ID provided' }) };
    }

    try {
        console.log(`☁️ Attempting to delete from Cloudinary: ${id}`);
        const result = await cloudinary.uploader.destroy(id);
        console.log('✅ Cloudinary result:', result);
        
        if (result.result === 'ok') {
            console.log(`🗑️ Successfully deleted: ${id}`);
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Deleted successfully' }) };
        } else {
            console.log(`⚠️ Cloudinary returned: ${result.result}`);
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Image removed' }) };
        }
    } catch (err) {
        console.error('❌ Cloudinary delete error:', err.message);
        console.error('Stack:', err.stack);
        return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: err.message }) };
    }
};