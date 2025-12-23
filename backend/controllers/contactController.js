// controllers/contactController.js

const { Resend } = require('resend');
const logger = require('../config/logger');

const resend = new Resend(process.env.EMAIL_API_KEY);

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Send email to admin
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'JobFinder <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL || 'moksh2072@chitkara.edu.in'],
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #667eea;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Reply to:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      logger.error('Resend API error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send email. Please try again later.' 
      });
    }

    logger.info(`Contact form email sent successfully. ID: ${data?.id}`);

    res.status(200).json({ 
      success: true, 
      message: 'Thank you for contacting us! We will get back to you soon.' 
    });
  } catch (error) {
    logger.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

module.exports = {
  sendContactEmail,
};
