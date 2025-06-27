const nodemailer = require("nodemailer");

const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // secure: false,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Apex Meridian" <${process.env.MAIL_USER}>`,
    to,
    subject: "Authentication",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; padding: 20px;">
          <h2 style="color: #333;">Hi,</h2>
          <p style="font-size: 16px; color: #444;">Here is your OTP. It will expire in <strong>5 minutes</strong>.</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; color: #2c3e50; font-weight: bold;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #888;">If you didn’t sign up on our platform, please ignore this email.</p>
          <p style="font-size: 14px; color: #aaa; margin-top: 30px;">— Apex Meridian Copy Trading</p>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
