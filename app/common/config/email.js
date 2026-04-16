import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `${process.env.SMTP_FROM_EMAIL}`,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (email, token) => {
  const subject = "Verify Your Email Address";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome! Please verify your email</h2>
      <p>Thank you for registering. Click the link below to verify your email address:</p>
      <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;
  const text = `Welcome! Please verify your email. Click the link to verify: ${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: `${process.env.SMTP_FROM_EMAIL}`,
    to: email,
    subject,
    html,
    text,
  });
};

export { sendMail, sendVerificationEmail };