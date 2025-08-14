const nodemailer = require("nodemailer");

const sendKycEmail = async (to) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    debug: true,
    logger: true,
  });

  // Unique content for Gmail freshness
  const dateNow = new Date().toLocaleString();
  const openers = [
    "Great news is always worth sharing!",
    "This is the email you’ve been waiting for.",
    "Your journey with Apex Meridian just got a green light.",
    "We’re excited to welcome you onboard!",
  ];
  const randomOpener = openers[Math.floor(Math.random() * openers.length)];

  const mailOptions = {
    from: `"Apex Meridian" <${process.env.MAIL_USER}>`,
    to,
    subject: "Account verification successful",
    html: `
      <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
        <div style="padding:20px;">
          <div style="max-width:500px;margin:auto;background:#fff;border-radius:8px;padding:20px;box-shadow:0 4px 8px rgba(0,0,0,0.1);">
            
            <p style="font-size:13px;color:#666;margin-bottom:10px;">
              Sent on ${dateNow} | ${randomOpener}
            </p>

            <h2 style="color:#333;margin-top:0;">Congratulations, ${to}!</h2>
            <p style="font-size:16px;color:#444;line-height:1.5;">
              Your account has been successfully verified. Next step: make a deposit to activate your account and start trading.
            </p>

            <div style="text-align:center;margin:30px 0;">
              <a href="https://apexmeridianctd.us/login" style="display:inline-block;padding:12px 24px;font-size:16px;color:#fff;background-color:#2c3e50;text-decoration:none;border-radius:5px;font-weight:bold;">
                Make a fast, safe deposit now!
              </a>
            </div>

            <p style="font-size:16px;color:#444;line-height:1.5;">
              The security of your funds is our top priority. We offer multiple payment methods, including cryptocurrency, for faster transactions, lower fees, and enhanced security.
            </p>

            <h3 style="color:#333;margin-top:20px;">Why Choose Crypto?</h3>
            <ul style="font-size:16px;color:#444;line-height:1.5;padding-left:20px;">
              <li style="margin-bottom:10px;"><strong>Speed:</strong> Crypto transactions are processed quickly.</li>
              <li style="margin-bottom:10px;"><strong>Global access:</strong> Deposit securely from anywhere in the world.</li>
              <li style="margin-bottom:10px;"><strong>Low fees:</strong> Pay less than traditional methods.</li>
            </ul>

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

module.exports = sendKycEmail;
