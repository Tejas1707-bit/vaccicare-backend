const express = require('express');
const router = require('express').Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/send', async (req, res) => {
  const { to, childName, vaccine, date, time, clinic } = req.body;

  const mailOptions = {
    from: `"VacciCare 💉" <${process.env.EMAIL_USER}>`,
    to,
    subject: `✅ Booking Confirmed — ${vaccine} for ${childName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1D9E75; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">💉 VacciCare</h1>
          <p style="color: #E1F5EE; margin: 4px 0 0;">Vaccination Booking Confirmation</p>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #eee;">
          <h2 style="color: #333; font-size: 18px;">Booking Confirmed! ✅</h2>
          <p style="color: #555; font-size: 14px;">Dear Parent,</p>
          <p style="color: #555; font-size: 14px;">Your vaccine appointment has been successfully booked.</p>
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #eee; margin: 16px 0;">
            <table style="width: 100%; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; color: #888; width: 40%;">Child Name</td>
                <td style="padding: 8px 0; color: #333; font-weight: 500;">${childName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; color: #888;">Vaccine</td>
                <td style="padding: 8px 0; color: #333; font-weight: 500;">${vaccine}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; color: #888;">Date</td>
                <td style="padding: 8px 0; color: #333; font-weight: 500;">${date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; color: #888;">Time</td>
                <td style="padding: 8px 0; color: #333; font-weight: 500;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Clinic</td>
                <td style="padding: 8px 0; color: #333; font-weight: 500;">${clinic}</td>
              </tr>
            </table>
          </div>
          <div style="background: #FFF8E1; padding: 12px; border-radius: 8px; margin: 16px 0;">
            <p style="color: #856404; font-size: 13px; margin: 0;">⚠️ Please arrive 10 minutes early. Bring your child's vaccination card.</p>
          </div>
          <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee;">
            <p style="color: #aaa; font-size: 12px; margin: 0;">VacciCare — Kids Vaccine Planner & Booking</p>
            <p style="color: #aaa; font-size: 12px; margin: 4px 0;">vaccicare.netlify.app</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', to);
    res.json({ success: true, message: 'Email sent!' });
  } catch (err) {
    console.log('❌ Email error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;