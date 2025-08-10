const nodemailer = require("nodemailer");

const sendDepositApprovalEmail = async (to, amount) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const depositDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedAmount = Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const mailOptions = {
    from: `"Apex Meridian" <${process.env.MAIL_USER}>`,
    to,
    subject: "Deposit Approved",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #28a745;">Deposit Approved</h2>
          <p style="font-size: 16px; color: #444;">
            Dear Client,
          </p>
          <p style="font-size: 16px; color: #444;">
            We are pleased to inform you that your deposit of 
            <strong style="color: green;">$${formattedAmount}</strong> 
            on <strong>${depositDate}</strong> has been successfully approved.
          </p>
          <p style="font-size: 16px; color: #444;">
            Your account balance has been updated accordingly. You can now log in to your dashboard to view the changes.
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #888; margin-top: 20px;">
            — Apex Meridian Copy Trading<br>
            This is an automated message. Please do not reply.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendDepositApprovalEmail;
