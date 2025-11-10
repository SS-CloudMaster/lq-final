// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname)); // serve your HTML & JS

// POST endpoint for contact form
app.post('/send', async (req, res) => {
  const { name, email, phone, service, budget, message } = req.body;

  // Configure your email service
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // or your SMTP host
    port: 587,
    secure: false,
    auth: {
      user: "youremail@gmail.com", // replace with your sender email
      pass: "your_app_password"    // use app password, not your Gmail password
    }
  });

  const mailOptions = {
    from: email,
    to: "youremail@gmail.com", // your receiving email
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service Needed:</strong> ${service}</p>
      <p><strong>Budget Range:</strong> ${budget}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error sending email.' });
  }
});

// Run the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));