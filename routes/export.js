 const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const EXPORT_PASSWORD = '661996'; // পাসওয়ার্ড

router.get('/', (req, res) => {
  const password = req.query.password;

  // পাসওয়ার্ড ভুল হলে Error দেখাবে
  if (password !== EXPORT_PASSWORD) {
    return res.status(401).send('⛔ Unauthorized: সঠিক পাসওয়ার্ড দিন');
  }

  const filePath = path.join(__dirname, '../data/codes.json');

  res.download(filePath, 'codes.json', (err) => {
    if (err) {
      res.status(500).send('⚠️ ফাইল ডাউনলোডে সমস্যা হয়েছে');
    }
  });
});

module.exports = router;
