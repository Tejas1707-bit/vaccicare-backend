const express = require('express');
const router = express.Router();

router.post('/send', async (req, res) => {
  const { phone, childName, vaccine, date, time } = req.body;

  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'q',
        message: `VacciCare: ${childName} appointment for ${vaccine} on ${date} at ${time}. Don't miss this vaccine!`,
        language: 'english',
        flash: 0,
        numbers: phone
      })
    });
    const data = await response.json();
    console.log('SMS API response:', JSON.stringify(data));
    res.json({ success: data.return === true, data });
  } catch (err) {
    console.log('SMS error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;