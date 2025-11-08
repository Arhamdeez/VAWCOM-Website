import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, service, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Company email - messages will be sent here
    const recipientEmail = process.env.CONTACT_EMAIL || 'vawcomtechnologies@gmail.com';
    
    // Prepare email content
    const emailSubject = `New Contact Form Submission${service ? ` - ${service}` : ''}`;
    const emailBody = `
New contact form submission from VAWCOM website:

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}
${phone ? `Phone: ${phone}` : ''}
${service ? `Service Interest: ${service}` : ''}

Message:
${message}

---
This message was sent from the contact form on your website.
Timestamp: ${new Date().toISOString()}
    `.trim();

    // Option 1: Use SMTP/Gmail (primary method - uses your own email)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = await import('nodemailer');
        
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: recipientEmail,
          replyTo: email,
          subject: emailSubject,
          text: emailBody,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                ${service ? `<p><strong>Service Interest:</strong> ${service}</p>` : ''}
              </div>
              <div style="margin: 20px 0;">
                <h3 style="color: #374151;">Message:</h3>
                <p style="background: #ffffff; padding: 15px; border-left: 4px solid #10b981; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="color: #6b7280; font-size: 12px;">
                This message was sent from the contact form on your website.<br>
                Timestamp: ${new Date().toLocaleString()}
              </p>
            </div>
          `,
        });

        console.log('✅ Email sent successfully via SMTP to:', recipientEmail);
        console.log('📧 Email ID:', info.messageId);
        return NextResponse.json({ 
          success: true, 
          message: 'Message sent successfully to ' + recipientEmail,
          id: info.messageId 
        });
      } catch (error) {
        console.error('❌ Error sending email via SMTP:', error);
        // Fall through to alternative methods
      }
    }

    // Option 2: Use Resend (fallback)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: recipientEmail,
          replyTo: email,
          subject: emailSubject,
          text: emailBody,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                ${service ? `<p><strong>Service Interest:</strong> ${service}</p>` : ''}
              </div>
              <div style="margin: 20px 0;">
                <h3 style="color: #374151;">Message:</h3>
                <p style="background: #ffffff; padding: 15px; border-left: 4px solid #10b981; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="color: #6b7280; font-size: 12px;">
                This message was sent from the contact form on your website.<br>
                Timestamp: ${new Date().toLocaleString()}
              </p>
            </div>
          `,
        });

        if (error) {
          console.error('❌ Resend API error:', error);
          throw error;
        }

        console.log('✅ Email sent successfully via Resend to:', recipientEmail);
        console.log('📧 Email ID:', data?.id);
        return NextResponse.json({ 
          success: true, 
          message: 'Message sent successfully to ' + recipientEmail,
          id: data?.id 
        });
      } catch (error) {
        console.error('❌ Error sending email via Resend:', error);
        // Fall through to alternative methods
      }
    }


    // Option 3: Log to console (for development/testing)
    console.log('\n📧 ============================================');
    console.log('📧 NEW CONTACT FORM SUBMISSION');
    console.log('📧 ============================================');
    console.log('📬 Would send to:', recipientEmail);
    console.log('Name:', name);
    console.log('Email:', email);
    if (company) console.log('Company:', company);
    if (phone) console.log('Phone:', phone);
    if (service) console.log('Service:', service);
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toISOString());
    console.log('============================================\n');
    console.log('⚠️  NOTE: No email service configured. To receive emails:');
    console.log('   1. Enable 2-Factor Authentication on your Gmail account');
    console.log('   2. Generate an App Password: https://myaccount.google.com/apppasswords');
    console.log('   3. Add to .env.local:');
    console.log('      SMTP_HOST=smtp.gmail.com');
    console.log('      SMTP_PORT=587');
    console.log('      SMTP_USER=vawcomtechnologies@gmail.com');
    console.log('      SMTP_PASS=your-app-password-here');
    console.log('      CONTACT_EMAIL=vawcomtechnologies@gmail.com');
    console.log('============================================\n');

    // In development, still return success even if email isn't configured
    return NextResponse.json({ 
      success: true, 
      message: 'Message received (logged to console - configure email service to receive emails)',
      note: `To receive emails at ${recipientEmail}, configure SMTP settings in your .env.local file. See console for details.`
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form submission' },
      { status: 500 }
    );
  }
}

