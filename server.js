// const express = require('express');
// const nodemailer = require('nodemailer');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const cors = require('cors');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// require('dotenv').config();

// const app = express();

// // ============ MIDDLEWARE ============
// app.use(cors());
// app.use(express.json());

// // ✅ Serve your website files
// app.use(express.static(path.join(__dirname, 'public')));

// // ============ CONFIGURATION ============
// const EMAIL_USER     = process.env.EMAIL_USER     || 'dancesarvah@gmail.com';
// const EMAIL_PASS     = process.env.EMAIL_PASS     || 'ozra mmde siro cder';
// const COMPANY_EMAIL  = process.env.COMPANY_EMAIL  || 'dancesarvah@gmail.com';
// const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sarvah123';
// const PORT           = process.env.PORT           || 3000;

// // ============ CLOUDINARY CONFIGURATION ============
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dccp0sxme',
//     api_key:    process.env.CLOUDINARY_API_KEY    || '471949222774489',
//     api_secret: process.env.CLOUDINARY_API_SECRET || 'TN60PQPNSqiCkzBJ7bgBEizq4EQ',
// });

// // ============ CLOUDINARY STORAGE ============
// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: 'sarvah-dance-academy',
//         allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
//         transformation: [{ quality: 'auto', fetch_format: 'auto' }]
//     }
// });

// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }
// });

// // ============ EMAIL TRANSPORTER ============
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: EMAIL_USER,
//         pass: EMAIL_PASS
//     }
// });

// transporter.verify((error, success) => {
//     if (error) {
//         console.error('❌ Email configuration error:', error);
//     } else {
//         console.log('✅ Email service is ready to send emails');
//     }
// });

// // ============ ADMIN PASSWORD VERIFY ============
// app.post('/api/admin/verify', (req, res) => {
//     const { password } = req.body;
//     if (password === ADMIN_PASSWORD) {
//         res.json({ success: true });
//     } else {
//         res.status(401).json({ success: false, message: 'Invalid admin password' });
//     }
// });

// // ============ CONTACT FORM API ============
// app.post('/api/contact', async (req, res) => {
//     const { name, email, phone, message } = req.body;

//     console.log(`📧 Contact form submission from: ${name} (${email})`);

//     if (!name || !email || !message) {
//         return res.status(400).json({
//             success: false,
//             message: 'Name, email, and message are required'
//         });
//     }

//     const companyMailOptions = {
//         from: `"Sarvah Website" <${EMAIL_USER}>`,
//         to: COMPANY_EMAIL,
//         subject: `📩 New Enquiry: ${name} - Sarvah Dance Academy`,
//         html: `
//             <!DOCTYPE html>
//             <html>
//             <head><meta charset="UTF-8"></head>
//             <body style="font-family: Georgia, serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
//                 <div style="background: #6B1A0A; padding: 20px; text-align: center; color: white;">
//                     <h2 style="margin: 0;">🕉️ Sarvah Dance Academy</h2>
//                     <p style="margin: 5px 0 0;">New Enquiry / Registration Form Submission</p>
//                 </div>
//                 <div style="background: #F7F0E3; padding: 30px; border: 1px solid #E8D9BB;">
//                     <table style="width: 100%; border-collapse: collapse;">
//                         <tr>
//                             <td style="padding: 10px; background: #EDE3CC; width: 120px;"><strong>Name:</strong></td>
//                             <td style="padding: 10px;">${name}</td>
//                         </tr>
//                         <tr>
//                             <td style="padding: 10px; background: #EDE3CC;"><strong>Email:</strong></td>
//                             <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
//                         </tr>
//                         <tr>
//                             <td style="padding: 10px; background: #EDE3CC;"><strong>Phone:</strong></td>
//                             <td style="padding: 10px;">${phone || 'Not provided'}</td>
//                         </tr>
//                         <tr>
//                             <td style="padding: 10px; background: #EDE3CC; vertical-align: top;"><strong>Message:</strong></td>
//                             <td style="padding: 10px;">${message.replace(/\n/g, '<br>')}</td>
//                         </tr>
//                     </table>
//                     <hr style="border: none; border-top: 1px solid #C09448; margin: 20px 0;">
//                     <p style="color: #6B5040; font-size: 12px; text-align: center;">
//                         Submitted from Sarvah Dance Academy Website<br>
//                         IP: ${req.ip} | Time: ${new Date().toLocaleString()}
//                     </p>
//                 </div>
//             </body>
//             </html>
//         `
//     };

//     const userMailOptions = {
//         from: `"Smt. Gayatri Inaayat – Sarvah Dance Academy" <${EMAIL_USER}>`,
//         to: email,
//         subject: '🙏 Namaste! Thank you for contacting Sarvah Dance Academy',
//         html: `
//             <!DOCTYPE html>
//             <html>
//             <head><meta charset="UTF-8"></head>
//             <body style="font-family: Georgia, serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
//                 <div style="background: #6B1A0A; padding: 20px; text-align: center; color: white;">
//                     <h2 style="margin: 0;">🕉️ Sarvah Dance Academy</h2>
//                     <p style="margin: 5px 0 0;">Preserving the Art of Bharatanatyam</p>
//                 </div>
//                 <div style="background: #F7F0E3; padding: 30px; border: 1px solid #E8D9BB;">
//                     <h3 style="color: #B84A1A; margin-top: 0;">Namaste ${name}! 🙏</h3>
//                     <p>Thank you for reaching out to <strong>Sarvah Dance Academy</strong>.</p>
//                     <p>We have received your message and are truly honoured by your interest in learning Bharatanatyam.</p>
//                     <p>Our team will review your inquiry and get back to you within <strong>24–48 hours</strong>.</p>
//                     <div style="background: #FFFDF8; padding: 15px; margin: 20px 0; border-left: 4px solid #C09448;">
//                         <p style="margin: 0; font-style: italic;">"Dance is the hidden language of the soul."</p>
//                         <p style="margin: 5px 0 0; color: #6B5040;">– Martha Graham</p>
//                     </div>
//                     <hr style="border: none; border-top: 1px solid #E8D9BB; margin: 20px 0;">
//                     <p style="margin: 0;">Warm regards,</p>
//                     <p style="margin: 5px 0 0; font-weight: bold;">Smt. Gayatri Inaayat</p>
//                     <p style="margin: 0; color: #6B5040;">Founder &amp; Artistic Director<br>Sarvah Dance Academy, London, Ontario</p>
//                     <div style="margin-top: 16px;">
//                         <a href="https://wa.me/19055971808" style="display:inline-block;background:#25D366;color:#fff;padding:8px 16px;text-decoration:none;font-size:0.8rem;border-radius:4px;margin-right:8px;">💬 WhatsApp</a>
//                         <a href="mailto:sarvahdance@gmail.com" style="display:inline-block;background:#6B1A0A;color:#fff;padding:8px 16px;text-decoration:none;font-size:0.8rem;border-radius:4px;">✉️ Email Us</a>
//                     </div>
//                     <hr style="border: none; border-top: 1px solid #E8D9BB; margin: 20px 0;">
//                     <p style="color: #999; font-size: 11px; text-align: center;">
//                         📍 London, Ontario, Canada<br>
//                         📧 ${EMAIL_USER}<br>
//                         This is an automated confirmation. Please do not reply directly to this email.
//                     </p>
//                 </div>
//             </body>
//             </html>
//         `
//     };

//     try {
//         await transporter.sendMail(companyMailOptions);
//         console.log(`✅ Email sent to company: ${COMPANY_EMAIL}`);
//         await transporter.sendMail(userMailOptions);
//         console.log(`✅ Confirmation email sent to: ${email}`);
//         res.json({ success: true, message: 'Emails sent successfully!' });
//     } catch (error) {
//         console.error('❌ Email error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to send email. Please try again later.'
//         });
//     }
// });

// // ============ GALLERY DATA FILE ============
// const GALLERY_DATA_FILE = path.join(__dirname, 'gallery-data.json');

// function loadGallery() {
//     if (!fs.existsSync(GALLERY_DATA_FILE)) return [];
//     try { return JSON.parse(fs.readFileSync(GALLERY_DATA_FILE, 'utf8')); }
//     catch (e) { return []; }
// }

// function saveGallery(gallery) {
//     fs.writeFileSync(GALLERY_DATA_FILE, JSON.stringify(gallery, null, 2));
// }

// // GET all gallery images
// app.get('/api/gallery', (req, res) => {
//     res.json(loadGallery());
// });

// // POST upload new image to Cloudinary
// // In server.js - this endpoint expects base64 imageData
// app.post('/api/gallery/upload', async (req, res) => {
//     const { password, title, imageData } = req.body;  // Note: imageData, not image
    
//     if (password !== ADMIN_PASSWORD) {
//         return res.status(401).json({ success: false, message: 'Invalid admin password' });
//     }
    
//     if (!imageData) {
//         return res.status(400).json({ success: false, message: 'No image data received' });
//     }
    
//     try {
//         // Upload base64 to Cloudinary
//         const result = await cloudinary.uploader.upload(imageData, {
//             folder: 'sarvah-dance-academy',
//             allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
//         });
        
//         const newImage = {
//             id: Date.now(),
//             url: result.secure_url,
//             public_id: result.public_id,
//             title: title || 'Sarvah Dance Performance',
//             uploadedAt: new Date().toISOString()
//         };
        
//         // Save to your gallery-data.json
//         const gallery = loadGallery();
//         gallery.push(newImage);
//         saveGallery(gallery);
        
//         res.json({ success: true, image: newImage });
//     } catch (error) {
//         console.error('Upload error:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // POST delete image from Cloudinary
// app.post('/api/gallery/delete', async (req, res) => {
//     const { password, id } = req.body;

//     if (password !== ADMIN_PASSWORD) {
//         return res.status(401).json({ success: false, message: 'Invalid admin password' });
//     }

//     let gallery = loadGallery();
//     const imageToDelete = gallery.find(img => img.id === parseInt(id));

//     if (imageToDelete) {
//         try {
//             // Delete from Cloudinary
//             await cloudinary.uploader.destroy(imageToDelete.public_id);
//             console.log(`🗑️  Deleted from Cloudinary: ${imageToDelete.public_id}`);
//         } catch (e) {
//             console.error('Cloudinary delete error:', e);
//         }
//         gallery = gallery.filter(img => img.id !== parseInt(id));
//         saveGallery(gallery);
//         console.log(`🗑️  Image removed from gallery: ${imageToDelete.title}`);
//     }

//     res.json({ success: true });
// });

// // ✅ Catch-all: serve index.html
// app.get('/{*path}', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // ============ START ============
// app.listen(PORT, () => {
//     console.log(`
// ╔══════════════════════════════════════════════════════╗
// ║     🕉️  SARVAH DANCE ACADEMY BACKEND  🕉️            ║
// ╠══════════════════════════════════════════════════════╣
// ║  🌐 Website  →  http://localhost:${PORT}              ║
// ║  📧 Email    →  ${EMAIL_USER}         ║
// ║  ☁️  Gallery  →  Cloudinary Cloud Storage            ║
// ║  🔐 Admin pw →  ${ADMIN_PASSWORD}                     ║
// ╚══════════════════════════════════════════════════════╝
//     `);
// });

const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// Debug middleware - log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ✅ Serve your website files
app.use(express.static(path.join(__dirname, 'public')));

// ============ CONFIGURATION ============
const EMAIL_USER     = process.env.EMAIL_USER     || 'dancesarvah@gmail.com';
const EMAIL_PASS     = process.env.EMAIL_PASS     || 'ozra mmde siro cder';
const COMPANY_EMAIL  = process.env.COMPANY_EMAIL  || 'dancesarvah@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sarvah123';
const PORT           = process.env.PORT           || 3000;

// ============ CLOUDINARY CONFIGURATION ============
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dccp0sxme',
    api_key:    process.env.CLOUDINARY_API_KEY    || '471949222774489',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'TN60PQPNSqiCkzBJ7bgBEizq4EQ',
});

// ============ CLOUDINARY STORAGE ============
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'sarvah-dance-academy',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// ============ DATA FILES ============
const HERO_DATA_FILE = path.join(__dirname, 'hero-data.json');
const GALLERY_DATA_FILE = path.join(__dirname, 'gallery-data.json');

// Load/Save Hero functions
function loadHeroImages() {
    if (!fs.existsSync(HERO_DATA_FILE)) {
        // Return default hero images if file doesn't exist
        const defaultHeroes = [
            { 
                id: 1, 
                url: '/images/hero/default1.jpg', 
                title: 'Traditional Bharatanatyam Performance',
                isDefault: true,
                uploadedAt: new Date().toISOString()
            },
            { 
                id: 2, 
                url: '/images/hero/default2.jpg', 
                title: 'Sarvah Dance Academy',
                isDefault: true,
                uploadedAt: new Date().toISOString()
            }
        ];
        saveHeroImages(defaultHeroes);
        return defaultHeroes;
    }
    try { 
        return JSON.parse(fs.readFileSync(HERO_DATA_FILE, 'utf8')); 
    } catch (e) { 
        console.error('Error loading hero images:', e);
        return []; 
    }
}

function saveHeroImages(heroImages) {
    try {
        fs.writeFileSync(HERO_DATA_FILE, JSON.stringify(heroImages, null, 2));
        console.log(`✅ Saved ${heroImages.length} hero images to file`);
    } catch (e) {
        console.error('Error saving hero images:', e);
    }
}

// Load/Save Gallery functions
function loadGallery() {
    if (!fs.existsSync(GALLERY_DATA_FILE)) return [];
    try { 
        return JSON.parse(fs.readFileSync(GALLERY_DATA_FILE, 'utf8')); 
    } catch (e) { 
        console.error('Error loading gallery images:', e);
        return []; 
    }
}

function saveGallery(gallery) {
    try {
        fs.writeFileSync(GALLERY_DATA_FILE, JSON.stringify(gallery, null, 2));
        console.log(`✅ Saved ${gallery.length} gallery images to file`);
    } catch (e) {
        console.error('Error saving gallery images:', e);
    }
}

// ============ EMAIL TRANSPORTER ============
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email configuration error:', error);
    } else {
        console.log('✅ Email service is ready to send emails');
    }
});

// ============ ADMIN PASSWORD VERIFY ============
app.post('/api/admin/verify', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid admin password' });
    }
});

// ============ CONTACT FORM API ============
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;

    console.log(`📧 Contact form submission from: ${name} (${email})`);

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and message are required'
        });
    }

    const companyMailOptions = {
        from: `"Sarvah Website" <${EMAIL_USER}>`,
        to: COMPANY_EMAIL,
        subject: `📩 New Enquiry: ${name} - Sarvah Dance Academy`,
        html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Georgia, serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                <div style="background: #6B1A0A; padding: 20px; text-align: center; color: white;">
                    <h2 style="margin: 0;">🕉️ Sarvah Dance Academy</h2>
                    <p style="margin: 5px 0 0;">New Enquiry / Registration Form Submission</p>
                </div>
                <div style="background: #F7F0E3; padding: 30px; border: 1px solid #E8D9BB;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; background: #EDE3CC; width: 120px;"><strong>Name:</strong></td>
                            <td style="padding: 10px;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; background: #EDE3CC;"><strong>Email:</strong></td>
                            <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; background: #EDE3CC;"><strong>Phone:</strong></td>
                            <td style="padding: 10px;">${phone || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; background: #EDE3CC; vertical-align: top;"><strong>Message:</strong></td>
                            <td style="padding: 10px;">${message.replace(/\n/g, '<br>')}</td>
                        </tr>
                    </table>
                    <hr style="border: none; border-top: 1px solid #C09448; margin: 20px 0;">
                    <p style="color: #6B5040; font-size: 12px; text-align: center;">
                        Submitted from Sarvah Dance Academy Website<br>
                        IP: ${req.ip} | Time: ${new Date().toLocaleString()}
                    </p>
                </div>
            </body>
            </html>
        `
    };

    const userMailOptions = {
        from: `"Smt. Gayatri Inaayat – Sarvah Dance Academy" <${EMAIL_USER}>`,
        to: email,
        subject: '🙏 Namaste! Thank you for contacting Sarvah Dance Academy',
        html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Georgia, serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                <div style="background: #6B1A0A; padding: 20px; text-align: center; color: white;">
                    <h2 style="margin: 0;">🕉️ Sarvah Dance Academy</h2>
                    <p style="margin: 5px 0 0;">Preserving the Art of Bharatanatyam</p>
                </div>
                <div style="background: #F7F0E3; padding: 30px; border: 1px solid #E8D9BB;">
                    <h3 style="color: #B84A1A; margin-top: 0;">Namaste ${name}! 🙏</h3>
                    <p>Thank you for reaching out to <strong>Sarvah Dance Academy</strong>.</p>
                    <p>We have received your message and are truly honoured by your interest in learning Bharatanatyam.</p>
                    <p>Our team will review your inquiry and get back to you within <strong>24–48 hours</strong>.</p>
                    <div style="background: #FFFDF8; padding: 15px; margin: 20px 0; border-left: 4px solid #C09448;">
                        <p style="margin: 0; font-style: italic;">"Dance is the hidden language of the soul."</p>
                        <p style="margin: 5px 0 0; color: #6B5040;">– Martha Graham</p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #E8D9BB; margin: 20px 0;">
                    <p style="margin: 0;">Warm regards,</p>
                    <p style="margin: 5px 0 0; font-weight: bold;">Smt. Gayatri Inaayat</p>
                    <p style="margin: 0; color: #6B5040;">Founder &amp; Artistic Director<br>Sarvah Dance Academy, London, Ontario</p>
                    <div style="margin-top: 16px;">
                        <a href="https://wa.me/19055971808" style="display:inline-block;background:#25D366;color:#fff;padding:8px 16px;text-decoration:none;font-size:0.8rem;border-radius:4px;margin-right:8px;">💬 WhatsApp</a>
                        <a href="mailto:sarvahdance@gmail.com" style="display:inline-block;background:#6B1A0A;color:#fff;padding:8px 16px;text-decoration:none;font-size:0.8rem;border-radius:4px;">✉️ Email Us</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #E8D9BB; margin: 20px 0;">
                    <p style="color: #999; font-size: 11px; text-align: center;">
                        📍 London, Ontario, Canada<br>
                        📧 ${EMAIL_USER}<br>
                        This is an automated confirmation. Please do not reply directly to this email.
                    </p>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(companyMailOptions);
        console.log(`✅ Email sent to company: ${COMPANY_EMAIL}`);
        await transporter.sendMail(userMailOptions);
        console.log(`✅ Confirmation email sent to: ${email}`);
        res.json({ success: true, message: 'Emails sent successfully!' });
    } catch (error) {
        console.error('❌ Email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email. Please try again later.'
        });
    }
});

// ============ HERO SECTION ENDPOINTS ============

// GET all hero images
app.get('/api/hero', (req, res) => {
    const heroImages = loadHeroImages();
    res.json(heroImages);
});

// POST upload new hero image to Cloudinary
app.post('/api/hero/upload', async (req, res) => {
    const { password, title, imageData } = req.body;
    
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Invalid admin password' });
    }
    
    if (!imageData) {
        return res.status(400).json({ success: false, message: 'No image data received' });
    }
    
    try {
        // Upload base64 to Cloudinary
        const result = await cloudinary.uploader.upload(imageData, {
            folder: 'sarvah-dance-academy/hero',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
        });
        
        const newImage = {
            id: Date.now(),
            url: result.secure_url,
            public_id: result.public_id,
            title: title || 'Hero Image',
            uploadedAt: new Date().toISOString(),
            isDefault: false
        };
        
        // Save to hero-data.json
        const heroImages = loadHeroImages();
        heroImages.push(newImage);
        saveHeroImages(heroImages);
        
        console.log(`✅ Hero image uploaded: ${newImage.title}`);
        res.json({ success: true, image: newImage });
    } catch (error) {
        console.error('Hero upload error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST delete hero image from Cloudinary
app.post('/api/hero/delete', async (req, res) => {
    const { password, id } = req.body;

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Invalid admin password' });
    }

    let heroImages = loadHeroImages();
    const imageToDelete = heroImages.find(img => img.id === parseInt(id));

    if (imageToDelete && !imageToDelete.isDefault) {
        try {
            // Delete from Cloudinary
            if (imageToDelete.public_id) {
                await cloudinary.uploader.destroy(imageToDelete.public_id);
                console.log(`🗑️ Deleted from Cloudinary: ${imageToDelete.public_id}`);
            }
        } catch (e) {
            console.error('Cloudinary delete error:', e);
        }
        heroImages = heroImages.filter(img => img.id !== parseInt(id));
        saveHeroImages(heroImages);
        console.log(`🗑️ Hero image removed: ${imageToDelete.title}`);
        res.json({ success: true, message: 'Hero image deleted successfully' });
    } else if (imageToDelete && imageToDelete.isDefault) {
        res.status(400).json({ success: false, message: 'Cannot delete default hero images' });
    } else {
        res.status(404).json({ success: false, message: 'Hero image not found' });
    }
});

// ============ GALLERY SECTION ENDPOINTS ============

// GET all gallery images
app.get('/api/gallery', (req, res) => {
    const gallery = loadGallery();
    res.json(gallery);
});

// POST upload new gallery image to Cloudinary
app.post('/api/gallery/upload', async (req, res) => {
    const { password, title, imageData } = req.body;
    
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Invalid admin password' });
    }
    
    if (!imageData) {
        return res.status(400).json({ success: false, message: 'No image data received' });
    }
    
    try {
        // Upload base64 to Cloudinary
        const result = await cloudinary.uploader.upload(imageData, {
            folder: 'sarvah-dance-academy/gallery',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
        });
        
        const newImage = {
            id: Date.now(),
            url: result.secure_url,
            public_id: result.public_id,
            title: title || 'Sarvah Dance Performance',
            uploadedAt: new Date().toISOString()
        };
        
        // Save to gallery-data.json
        const gallery = loadGallery();
        gallery.push(newImage);
        saveGallery(gallery);
        
        console.log(`✅ Gallery image uploaded: ${newImage.title}`);
        res.json({ success: true, image: newImage });
    } catch (error) {
        console.error('Gallery upload error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST delete gallery image from Cloudinary
app.post('/api/gallery/delete', async (req, res) => {
    const { password, id } = req.body;

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Invalid admin password' });
    }

    let gallery = loadGallery();
    const imageToDelete = gallery.find(img => img.id === parseInt(id) || img.public_id === id);

    if (imageToDelete) {
        try {
            // Delete from Cloudinary
            if (imageToDelete.public_id) {
                await cloudinary.uploader.destroy(imageToDelete.public_id);
                console.log(`🗑️ Deleted from Cloudinary: ${imageToDelete.public_id}`);
            }
        } catch (e) {
            console.error('Cloudinary delete error:', e);
        }
        
        gallery = gallery.filter(img => img.id !== imageToDelete.id && img.public_id !== id);
        saveGallery(gallery);
        console.log(`🗑️ Gallery image removed: ${imageToDelete.title}`);
        res.json({ success: true, message: 'Gallery image deleted successfully' });
    } else {
        console.log(`⚠️ Image with id ${id} not found in gallery`);
        res.status(404).json({ success: false, message: 'Gallery image not found' });
    }
});

// ============ DEBUG ENDPOINT ============
app.get('/api/debug/files', (req, res) => {
    const heroExists = fs.existsSync(HERO_DATA_FILE);
    const galleryExists = fs.existsSync(GALLERY_DATA_FILE);
    
    res.json({
        hero: {
            exists: heroExists,
            count: heroExists ? loadHeroImages().length : 0,
            images: heroExists ? loadHeroImages().map(img => ({ id: img.id, title: img.title, isDefault: img.isDefault })) : []
        },
        gallery: {
            exists: galleryExists,
            count: galleryExists ? loadGallery().length : 0
        }
    });
});

// ============ SERVE STATIC FILES ============
// Serve images from public directory
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// ✅ Catch-all: serve index.html for client-side routing
app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// ============ START SERVER ============
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║     🕉️  SARVAH DANCE ACADEMY BACKEND  🕉️            ║
╠══════════════════════════════════════════════════════╣
║  🌐 Website  →  http://localhost:${PORT}              ║
║  📧 Email    →  ${EMAIL_USER}                         ║
║  ☁️  Gallery  →  Cloudinary Cloud Storage            ║
║  🖼️  Hero     →  Cloudinary + Local JSON            ║
║  🔐 Admin pw →  ${ADMIN_PASSWORD}                     ║
╚══════════════════════════════════════════════════════╝
    `);
});