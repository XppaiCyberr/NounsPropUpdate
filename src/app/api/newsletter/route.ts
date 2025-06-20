import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    // Check if environment variables are set
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials not configured');
      return Response.json({ 
        error: 'Email service not configured. Please try again later.' 
      }, { status: 500 });
    }
    
    // Create transporter with environment variables
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true' || true, // Use TLS for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    // Email content
    const mailOptions = {
      from: `"Nounsletter" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: '🏛️ Welcome to Nouns Proposals Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; font-size: 28px; margin-bottom: 10px;">🏛️ Nouns Proposals</h1>
            <p style="color: #6b7280; font-size: 16px;">Stay updated with the latest Nouns DAO proposals</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 15px;">Welcome to the community! 🎉</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 15px;">
              Thank you for subscribing to our Nouns Proposals newsletter. You'll now receive updates about:
            </p>
            <ul style="color: #475569; line-height: 1.6; margin-left: 20px;">
              <li>New proposals and voting opportunities</li>
              <li>Proposal status updates and results</li>
              <li>Community discussions and feedback</li>
              <li>Important governance announcements</li>
            </ul>
          </div>
          
          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <p style="color: #1e40af; margin: 0; font-weight: 500;">
              🗳️ Your voice matters in the Nouns ecosystem. Stay engaged and help shape the future of decentralized governance!
            </p>
          </div>
          
          <div style="text-align: center; color: #9ca3af; font-size: 14px;">
            <p>This email was sent because you subscribed to Nouns Proposals updates.</p>
            <p>If you didn't subscribe, you can safely ignore this email.</p>
          </div>
        </div>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    return Response.json({ 
      success: true, 
      message: 'Newsletter subscription confirmed! Check your email.' 
    });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return Response.json({ 
      error: 'Failed to send confirmation email. Please try again.' 
    }, { status: 500 });
  }
}
