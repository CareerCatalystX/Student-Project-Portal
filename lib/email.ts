import nodemailer from 'nodemailer';

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
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Signup/Signin',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
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