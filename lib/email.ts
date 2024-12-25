import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Or any other SMTP provider
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