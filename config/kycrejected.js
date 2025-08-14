const nodemailer = require("nodemailer");

const sendKycRejectedEmail = async (to) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    debug: true,
    logger: true,
  });

  // Create unique content for Gmail freshness
  const dateNow = new Date().toLocaleString();
  const tips = [
    "Make sure your ID photo is taken in good lighting.",
    "Ensure all 4 corners of your document are visible.",
    "Use a high-resolution image for better clarity.",
    "Avoid glare and shadows when photographing documents.",
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  const mailOptions = {
    from: `"Apex Meridian" <${process.env.MAIL_USER}>`,
    to,
    subject: "Account verification failed",
    html: `
      <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
        <div style="padding:20px;">
          <div style="max-width:500px;margin:auto;background:#fff;border-radius:8px;padding:20px;box-shadow:0 4px 8px rgba(0,0,0,0.1);">
            
            <p style="font-size:13px;color:#666;margin-bottom:10px;">
              Sent on ${dateNow} | Tip: ${randomTip}
            </p>

            <h2 style="color:#333;margin-top:0;">Hello ${to},</h2>
            <p style="font-size:16px;color:#444;line-height:1.5;">
              We regret to inform you that your recent account verification submission was unsuccessful.
            </p>
            <p style="font-size:16px;color:#444;line-height:1.5;">
              To help you resolve this, here are the details regarding the rejection:
            </p>

            <div style="background-color:#f8d7da;border:1px solid #f5c6cb;color:#721c24;padding:15px;border-radius:5px;margin:20px 0;">
              <p style="margin:0;"><strong>Reason for rejection:</strong></p>
              <p style="margin:5px 0 0 0;">Unclear/Blurry document</p>
              <p style="margin:15px 0 0 0;font-style:italic;">
                Please resubmit your documents ensuring they meet the requirements above. Our support team is available to assist you.
              </p>
            </div>

            <p style="font-size:16px;color:#444;line-height:1.5;">
              You can try submitting your verification documents again through your account dashboard.
            </p>

            <div style="text-align:center;margin:30px 0;">
              <a href="https://apexmeridianctd.us/login" style="display:inline-block;padding:12px 24px;font-size:16px;color:#fff;background-color:#e74c3c;text-decoration:none;border-radius:5px;font-weight:bold;">
                Resubmit Documents
              </a>
            </div>

            <p style="font-size:12px;color:#888;margin-top:20px;">
              — Apex Meridian Team
            </p>

          </div>
        </div>
      </body>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendKycRejectedEmail;

