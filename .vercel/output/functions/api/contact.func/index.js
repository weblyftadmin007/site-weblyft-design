const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.FORM_EMAIL_USER,
      pass: process.env.FORM_EMAIL_PASS,
    },
  });

  let body = {};
  if (typeof req.body === 'string') {
    req.body.split('&').forEach(pair => {
      const [key, val] = pair.split('=').map(decodeURIComponent);
      body[key] = val;
    });
  } else {
    body = req.body || {};
  }

  const recipient = body._recipient || process.env.FORM_EMAIL_USER;
  const subject = body._subject || 'New Form Submission';

  const fields = Object.entries(body)
    .filter(([k]) => !k.startsWith('_'))
    .map(([k, v]) => `<tr><td style="font-weight:600;padding:8px 12px;border-bottom:1px solid #eee;white-space:nowrap">${k}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${v}</td></tr>`)
    .join('');

  try {
    await transporter.sendMail({
      from: `"${body.name || 'Website Form'}" <${process.env.FORM_EMAIL_USER}>`,
      replyTo: body.email || process.env.FORM_EMAIL_USER,
      to: recipient,
      subject,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#333;border-bottom:2px solid #eee;padding-bottom:12px">${subject}</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">${fields}</table>
          <p style="color:#999;font-size:12px;margin-top:24px;padding-top:12px;border-top:1px solid #eee">
            Sent via your website &mdash; ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
      <title>Thank You</title>
      <script src="https://cdn.tailwindcss.com" defer></script>
      </head>
      <body class="bg-gray-50 flex items-center justify-center min-h-screen p-4">
        <div class="text-center max-w-md mx-auto">
          <div class="text-5xl mb-4">&#10003;</div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p class="text-gray-500 mb-6">Your message has been sent. We'll get back to you within 24 hours.</p>
          <a href="/" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">Back to Home</a>
        </div>
      </body>
      </html>
    `);
  } catch {
    res.status(500).send('Error sending email. Please try again later.');
  }
};
