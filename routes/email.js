const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/send', async (req, res) => {
  const { to, childName, vaccine, date, time, clinic } = req.body;
  try {
    const { data, error } = await resend.emails.send({
      from: 'VacciCare <onboarding@resend.dev>',
      to,
      subject: `✅ Booking Confirmed — ${vaccine} for ${childName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1D9E75; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">💉 VacciCare</h1>
            <p style="color: #E1F5EE; margin: 4px 0 0;">Vaccination Booking Confirmation</p>
          </div>
          <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #eee;">
            <h2 style="color: #333;">Booking Confirmed! ✅</h2>
            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #eee; margin: 16px 0;">
              <table style="width: 100%; font-size: 14px;">
                <tr><td style="padding: 8px 0; color: #888;">Child Name</td><td style="font-weight: 500;">${childName}</td></tr>
                <tr><td style="padding: 8px 0; color: #888;">Vaccine</td><td style="font-weight: 500;">${vaccine}</td></tr>
                <tr><td style="padding: 8px 0; color: #888;">Date</td><td style="font-weight: 500;">${date}</td></tr>
                <tr><td style="padding: 8px 0; color: #888;">Time</td><td style="font-weight: 500;">${time}</td></tr>
                <tr><td style="padding: 8px 0; color: #888;">Clinic</td><td style="font-weight: 500;">${clinic}</td></tr>
              </table>
            </div>
            <div style="background: #FFF8E1; padding: 12px; border-radius: 8px;">
              <p style="color: #856404; font-size: 13px; margin: 0;">⚠️ Please arrive 10 minutes early. Bring your child's vaccination card.</p>
            </div>
            <div style="text-align: center; margin-top: 24px; border-top: 1px solid #eee; padding-top: 16px;">
              <p style="color: #aaa; font-size: 12px;">VacciCare — vaccicare.netlify.app</p>
            </div>
          </div>
        </div>
      `
    });
    if (error) {
      console.log('❌ Email error:', error);
      return res.json({ success: false, error });
    }
    console.log('✅ Email sent:', data);
    res.json({ success: true, data });
  } catch (err) {
    console.log('❌ Email error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;