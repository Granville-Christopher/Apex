const nodemailer = require("nodemailer");

const sendWithdrawEmail = async (to, amount) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const withdrawDate = new Date().toLocaleDateString("en-US", {
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
    subject: "Withdrawal Request Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #333;">Withdrawal Request</h2>
          <p style="font-size: 16px; color: #444;">
            Dear Client,
          </p>
          <p style="font-size: 16px; color: #444;">
            We have received your withdrawal request of 
            <strong style="color: red;">$${formattedAmount}</strong> 
            on <strong>${withdrawDate}</strong>.
          </p>
          <p style="font-size: 16px; color: #444;">
            Your withdrawal is now pending verification. You will be notified once it has been processed.
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

module.exports = sendWithdrawEmail;
