import nodemailer from 'nodemailer';

const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const resetUrl = `${process.env.ORIGIN}/reset-password/${resetToken}`; 

  await transporter.sendMail({
    from: '"Devconnect" <devconnectnow@gmail.com>',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #3b82f6;">Password Reset Request</h1>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333;">You requested a password reset. To reset your password, please click the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333;">This link will expire in 1 hours</p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333;">If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
        
        <p style="font-size: 14px; line-height: 1.5; color: #666; word-break: break-all;">${resetUrl}</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px;">
          <p>© ${new Date().getFullYear()} Devconnect. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

export default sendPasswordResetEmail;
