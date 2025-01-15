import nodemailer from 'nodemailer';

type EmailOptions = { to: string; subject: string; text: string; };

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use false for STARTTLS; true for SSL on port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use the app password here
  },
});

export async function sendEmail({ to, subject, text }: EmailOptions): Promise<void> {
  try {
    console.log('Sending email...');
    const info = await transporter.sendMail({
      from: `"BG Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log('Message sent successfully');
  } catch (error: any) {
    console.error('Error sending email:', error.message);
  }
}