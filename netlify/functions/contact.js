// const nodemailer = require('nodemailer');

// const EMAIL_USER    = process.env.EMAIL_USER    || 'sarvahdance@gmail.com';
// const EMAIL_PASS    = process.env.EMAIL_PASS    || '';
// const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'sarvahdance@gmail.com';

// const headers = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Headers': 'Content-Type',
//     'Access-Control-Allow-Methods': 'POST, OPTIONS'
// };

// exports.handler = async (event) => {
//     if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
//     if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ success: false }) };

//     let body;
//     try { body = JSON.parse(event.body); }
//     catch { return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid request' }) }; }

//     const { name, email, phone, message } = body;

//     if (!name || !email || !message) {
//         return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Name, email, and message are required.' }) };
//     }

//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: { user: EMAIL_USER, pass: EMAIL_PASS }
//     });

//     const toCompany = {
//         from: `"Sarvah Website" <${EMAIL_USER}>`,
//         to: COMPANY_EMAIL,
//         subject: `📩 New Enquiry: ${name}`,
//         html: `<div style="font-family:Georgia,serif;max-width:600px">
//             <div style="background:#6B1A0A;padding:20px;color:white;text-align:center"><h2>🕉️ Sarvah Dance Academy</h2></div>
//             <div style="background:#F7F0E3;padding:30px;border:1px solid #E8D9BB">
//                 <p><strong>Name:</strong> ${name}</p>
//                 <p><strong>Email:</strong> ${email}</p>
//                 <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
//                 <p><strong>Message:</strong><br>${message.replace(/\n/g,'<br>')}</p>
//                 <hr><p style="color:#999;font-size:11px">Submitted at: ${new Date().toLocaleString()}</p>
//             </div></div>`
//     };

//     const toUser = {
//         from: `"Ms. Gayatri Inaayat – Sarvah Dance Academy" <${EMAIL_USER}>`,
//         to: email,
//         subject: '🙏 Namaste! Thank you for contacting Sarvah Dance Academy',
//         html: `
//         <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
//         <body style="font-family:Georgia,serif;max-width:600px;margin:0 auto;">
//           <div style="background:#6B1A0A;padding:20px;text-align:center;color:white;">
//             <h2 style="margin:0;">🕉️ Sarvah Dance Academy</h2>
//             <p style="margin:5px 0 0;">Preserving the Art of Bharatanatyam</p>
//           </div>
//           <div style="background:#F7F0E3;padding:30px;border:1px solid #E8D9BB;">
//             <h3 style="color:#B84A1A;margin-top:0;">Namaste ${name}! 🙏</h3>
//             <p>Thank you for reaching out to <strong>Sarvah Dance Academy</strong>.</p>
//             <p>We have received your message and are truly honoured by your interest in learning Bharatanatyam.</p>
//             <p>Our team will get back to you within <strong>24–48 hours</strong>.</p>
//             <div style="background:#FFFDF8;padding:15px;margin:20px 0;border-left:4px solid #C09448;">
//               <p style="margin:0;font-style:italic;">"Dance is the hidden language of the soul."</p>
//               <p style="margin:5px 0 0;color:#6B5040;">– Martha Graham</p>
//             </div>
//             <hr style="border:none;border-top:1px solid #E8D9BB;margin:20px 0;">
//             <p style="margin:0;">Warm regards,</p>
//             <p style="margin:5px 0 0;font-weight:bold;">Ms. Gayatri Inaayat</p>
//             <p style="margin:0;color:#6B5040;">Founder & Artistic Director<br>Sarvah Dance Academy, London, Ontario</p>
//             <div style="margin-top:16px;">
//               <a href="https://wa.me/19055871808" style="display:inline-block;background:#25D366;color:#fff;padding:8px 16px;text-decoration:none;border-radius:4px;margin-right:8px;font-size:0.8rem;">💬 WhatsApp</a>
//               <a href="mailto:sarvahdance@gmail.com" style="display:inline-block;background:#6B1A0A;color:#fff;padding:8px 16px;text-decoration:none;border-radius:4px;font-size:0.8rem;">✉️ Email Us</a>
//             </div>
//             <hr style="border:none;border-top:1px solid #E8D9BB;margin:20px 0;">
//             <p style="color:#aaa;font-size:11px;text-align:center;">
//               📍 London, Ontario, Canada | 📧 ${EMAIL_USER}<br>
//               This is an automated confirmation — please do not reply directly.
//             </p>
//           </div>
//         </body></html>`
//     };

//     try {
//         await transporter.sendMail(toCompany);
//         await transporter.sendMail(toUser);
//         return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Emails sent successfully!' }) };
//     } catch (error) {
//         console.error('Email error:', error);
//         return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Failed to send email.' }) };
//     }
// };

const nodemailer = require('nodemailer');

// Reads credentials from Netlify's own Environment Variables (Site settings →
// Environment variables) — never hardcode these here.
const EMAIL_USER    = process.env.EMAIL_USER;
const EMAIL_PASS    = process.env.EMAIL_PASS; // Gmail App Password, not your normal password
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || EMAIL_USER;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }
});

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
    }

    if (!EMAIL_USER || !EMAIL_PASS) {
        console.error('Missing EMAIL_USER/EMAIL_PASS in Netlify environment variables');
        return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Email not configured on server' }) };
    }

    let data;
    try {
        data = JSON.parse(event.body || '{}');
    } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Invalid request body' }) };
    }

    const { name, email, phone, message } = data;
    if (!name || !email || !message) {
        return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Missing required fields' }) };
    }

    try {
        // Notify the academy
        await transporter.sendMail({
            from: `"Sarvah Website" <${EMAIL_USER}>`,
            to: COMPANY_EMAIL,
            subject: `📩 New Enquiry: ${name}`,
            html: `<div style="font-family:Georgia,serif;max-width:600px">
                <div style="background:#6B1A0A;padding:20px;color:white;text-align:center"><h2>🕉️ Sarvah Dance Academy</h2></div>
                <div style="background:#F7F0E3;padding:30px;border:1px solid #E8D9BB">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <p><strong>Message:</strong><br>${String(message).replace(/\n/g, '<br>')}</p>
                </div></div>`
        });

        // Auto-reply to the customer
        await transporter.sendMail({
            from: `"Sarvah Dance Academy" <${EMAIL_USER}>`,
            to: email,
            subject: '🙏 Namaste! Thank you for contacting Sarvah Dance Academy',
            html: `<div style="font-family:Georgia,serif;max-width:600px">
                <div style="background:#6B1A0A;padding:20px;color:white;text-align:center"><h2>🕉️ Sarvah Dance Academy</h2></div>
                <div style="background:#F7F0E3;padding:30px;border:1px solid #E8D9BB">
                    <h3 style="color:#B84A1A">Namaste ${name}! 🙏</h3>
                    <p>Thank you for your interest in Sarvah Dance Academy. We'll be in touch within <strong>24–48 hours</strong>.</p>
                    <p style="color:#999;font-size:11px;margin-top:20px">📍 London, Ontario, Canada</p>
                </div></div>`
        });

        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (e) {
        console.error('❌ Contact email error:', e.message);
        return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Email failed: ' + e.message }) };
    }
};