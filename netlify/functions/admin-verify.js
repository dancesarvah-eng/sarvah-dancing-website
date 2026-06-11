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
    catch { return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid request' }) }; }

    const { password } = body;
    if (password === ADMIN_PASSWORD) {
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Invalid password' }) };
};