const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendAdminContactAlert({ name, email, subject, message, phone }) {
    //     const html = `
    //     <h2>New Contact Message</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
    //     <p><strong>Message:</strong></p>
    //     <pre style="font-family:inherit;white-space:pre-wrap">${message}</pre>
    //     <hr/>
    //     <p>Time: ${new Date().toISOString()}</p>
    //   `;


    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <body style="font-family: Arial; background-color:#f6f9fc; padding:20px;">
          <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <div style="background:#007bff; color:#fff; padding:15px; border-radius:10px 10px 0 0;">
              <h2>📩 New Contact Message</h2>
            </div>
            <div style="padding:20px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Message:</strong><br>${message}</p>
            </div>
            <div style="background:#f1f1f1; text-align:center; padding:10px; font-size:12px;">
              &copy; ${new Date().getFullYear()} AgriTech. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
    return transporter.sendMail({
        from: `"Website Contact" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_NOTIFY_EMAIL,
        subject: `New contact message${subject ? `: ${subject}` : ""}`,
        html,
        replyTo: email,
    });
}

module.exports = { transporter, sendAdminContactAlert };
