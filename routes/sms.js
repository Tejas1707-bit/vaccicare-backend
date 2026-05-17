const express = require('express');
const router = express.Router();

router.post('/send', async (req, res) => {
  const { phone, childName, vaccine, date, time } = req.body;

  const message = `VacciCare: ${childName}'s ${vaccine} is booked on ${date} at ${time}. Please don't miss this vaccine! -VacciCare`;

  try {
    const response = await fetch(
      `https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&route=q&message=${encodeURIComponent(message)}&language=english&flash=0&numbers=${phone}`,
      { method: 'GET' }
    );
    const data = await response.json();
    console.log('SMS response:', data);
    if (data.return === true) {
      res.json({ success: true, data });
    } else {
      res.json({ success: false, data });
    }
  } catch (err) {
    console.log('SMS error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;