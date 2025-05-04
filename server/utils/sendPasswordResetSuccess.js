import nodemailer from 'nodemailer';
import { capitalizeUsername }  from "./capitalize.js";

const sendPasswordResetSuccess = async (email, username) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });


  await transporter.sendMail({
    from: '"Devconnect" <devconnectnow@gmail.com>',
    to: email,
    subject: 'Password Reset Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #3b82f6;">Password Reset Confirmation</h1>
        </div>

        <p>Hi ${capitalizeUsername(username)},</p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333;">Your password has been successfully reset. You can now login to your account with your new password. If you did not request a password reset, please ignore this email.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px;">
          <p>© ${new Date().getFullYear()} Devconnect. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

export default sendPasswordResetSuccess;
