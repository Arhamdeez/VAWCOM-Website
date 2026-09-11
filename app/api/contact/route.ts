import { NextRequest, NextResponse } from 'next/server';

type Fields = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message: string;
};

function buildBodies({ name, email, company, phone, service, message }: Fields) {
  const text = `
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

  const html = `
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
  `;

  return { text, html };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const recipientEmail = process.env.CONTACT_EMAIL || 'vawcomtechnologies@gmail.com';
    const emailSubject = `New Contact Form Submission${service ? ` - ${service}` : ''}`;
    const { text: emailBody, html } = buildBodies({
      name,
      email,
      company,
      phone,
      service,
      message,
    });

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
          html,
        });
        if (error) throw error;
        return NextResponse.json({
          success: true,
          message: 'Message sent successfully to ' + recipientEmail,
          id: data?.id,
        });
      } catch (error) {
        console.error('Resend error:', error);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Email service not configured',
        message: 'Message received but email could not be sent.',
      },
      { status: 500 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form submission' },
      { status: 500 }
    );
  }
}
