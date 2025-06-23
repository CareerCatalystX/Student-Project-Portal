import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 465,
  secure: true, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

export async function sendOTP(email: string, otp: string) {
  // Read the logo image and convert to base64 (optional approach)
  const logoPath = path.join(process.cwd(), 'public', '/logo-master.png'); // Adjust filename as needed
  let logoBase64 = '';

  try {
    const logoBuffer = fs.readFileSync(logoPath);
    logoBase64 = logoBuffer.toString('base64');
  } catch (error) {
    console.log('Logo not found, proceeding without image');
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Career CatalystX - OTP Verification</title>
    </head>
    <body style="margin: 0; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style=" margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            
            <!-- Header with Gradient -->
            <tr>
                <td style="background: #667eea; background: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; color: white;">
                    ${logoBase64 ? `<img src="cid:logo@catalystx" alt="Career CatalystX Logo" style="max-width: 150px;" />` : ''}
                    <h1 style="font-size: 28px; font-weight: bold; margin: 10px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">Career CatalystX</h1>
                    <p style="font-size: 14px; margin: 5px 0 0 0; opacity: 0.9;">Accelerating Your Career Journey</p>
                </td>
            </tr>
            
            <!-- Gradient Divider -->
            <tr>
                <td style="height: 4px; background: #667eea; background: -webkit-linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c); background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);"></td>
            </tr>
            
            <!-- Main Content -->
            <tr>
                <td style="padding: 40px 30px; text-align: center;">
                    <div style="font-size: 18px; color: #333; margin-bottom: 20px;">
                        Hello there! 👋
                    </div>
                    
                    <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 20px 0;">
                        We received a request to verify your email address. Please use the OTP code below to complete your signup/signin process.
                    </p>
                    
                    <!-- OTP Section with Gradient -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                            <td style="background: #f093fb; background: -webkit-linear-gradient(135deg, #f093fb 0%, #f5576c 100%); background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 15px; padding: 30px; text-align: center;">
                                <div style="color: white; font-size: 16px; margin-bottom: 15px; font-weight: 600;">Your Verification Code</div>
                                <div style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px; margin: 10px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">${otp}</div>
                                <div style="color: white; font-size: 14px; opacity: 0.9;">⏰ Valid for 10 minutes</div>
                            </td>
                        </tr>
                    </table>
                    
                    <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 20px 0;">
                        Enter this code in the verification field to continue with your Career CatalystX experience.
                    </p>
                    
                    <!-- Security Note -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                        <tr>
                            <td style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; color: #856404;">
                                🔐 <strong>Security Note:</strong> Never share this OTP with anyone. Career CatalystX will never ask for your OTP via phone or email.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Gradient Divider -->
            <tr>
                <td style="height: 4px; background: #667eea; background: -webkit-linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c); background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);"></td>
            </tr>
            
            <!-- Footer -->
            <tr>
                <td style="background-color: #2d3436; color: white; padding: 20px; text-align: center; font-size: 14px;">
                    <p style="margin: 5px 0;">© 2024 Career CatalystX. All rights reserved.</p>
                    <p style="margin: 5px 0;">
                        Need help? Contact us at 
                        <a href="mailto:support@careercatalystx.com" style="color: #74b9ff; text-decoration: none;">support@careercatalystx.com</a>
                    </p>
                    <p style="font-size: 12px; opacity: 0.8; margin: 15px 0 5px 0;">
                        This is an automated message. Please do not reply to this email.
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `Career CatalystX <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Career CatalystX Verification Code',
    text: `Hello from Career CatalystX!\n\nYour OTP verification code is: ${otp}\n\nThis code is valid for 10 minutes.\n\nNever share this OTP with anyone for security reasons.\n\nBest regards,\nCareer CatalystX Team`,
    html: htmlContent,
    attachments: [
      {
        filename: 'logo-master.png',
        path: path.join(process.cwd(), 'public', '/logo-master.png'),
        cid: 'logo@catalystx'
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}

export async function sendEmail(email: string, title: string, message: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: title,
    text: message,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendApplicationStatusEmail(
  studentEmail: string,
  studentName: string,
  projectName: string,
  professorName: string,
  status: 'accepted' | 'rejected'
) {
  const statusMessage =
    status === 'accepted'
      ? 'Congratulations! Your application has been accepted.'
      : 'Unfortunately, your application has been rejected.';

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #4CAF50;">${status === 'accepted' ? 'Application Accepted' : 'Application Rejected'}</h2>
      <p>Dear ${studentName},</p>
      <p>${statusMessage}</p>
      <p><strong>Project Name:</strong> ${projectName}</p>
      <p><strong>Professor Name:</strong> ${professorName}</p>
      <p>We wish you the best in your endeavors!</p>
      <p>Best regards,</p>
      <p><strong>${professorName}</strong></p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: `Your Application for ${projectName} has been ${status}`,
    html: htmlMessage,
  };

  await transporter.sendMail(mailOptions);
}