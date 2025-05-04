import nodemailer from 'nodemailer';

const sendActivationEmail = async (email, username, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or any service you're using
    auth: {
      user: process.env.EMAIL_USERNAME, // your email
      pass: process.env.EMAIL_PASSWORD  // app password
    }
  });

  const activationLink = `${process.env.ORIGIN}/activate/${token}`; 

  await transporter.sendMail({
    from: '"Devconnect" <devconnectnow@gmail.com>',
    to: email,
    subject: 'Activate Your Devconnect Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #3b82f6;">Welcome to Devconnect!</h1>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333;">Hi ${username},</p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333;">Thank you for registering with Devconnect. To complete your registration and activate your account, please click the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${activationLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Activate My Account</a>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333;">This link will expire in 24 hours. If you did not create an account, please ignore this email.</p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333;">If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
        
        <p style="font-size: 14px; line-height: 1.5; color: #666; word-break: break-all;">${activationLink}</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px;">
          <p>© ${new Date().getFullYear()} Devconnect. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

export default sendActivationEmail;
