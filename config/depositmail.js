const nodemailer = require("nodemailer");

const sendDepositMail = async (to, amount, network, walletAddress) => {
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
    from: `"Stratium" <${process.env.MAIL_USER}>`,
    to,
    subject: "Deposit Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #333;">Deposit Confirmation</h2>
          <p style="font-size: 16px; color: #444;">
            Dear Client,
          </p>
          <p style="font-size: 16px; color: #444;">
            We have received your deposit request of 
            <strong style="color: green;">$${formattedAmount}</strong> 
            on <strong>${depositDate}</strong>.
          </p>
          <p style="font-size: 16px; color: #444;">
            <strong>Network:</strong> ${network}<br>
            <strong>Wallet Address:</strong> ${walletAddress}
          </p>
          <p style="font-size: 16px; color: #444;">
            Your balance will be updated shortly after verification.
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #888; margin-top: 20px;">
            — Stratium Copy Trading<br>
            This is an automated message. Please do not reply.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendDepositMail;
