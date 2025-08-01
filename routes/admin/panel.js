const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const CSV_PATH = path.join(process.cwd(), 'data', 'newsletter.csv');
const sessionCheck = require('../../middleware/sessionCheck');

router.get('/admin/panel', sessionCheck, (req, res) => {
  const lines = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n');
  const header = lines[0].split(',');
  const users = lines.slice(1).map(line => {
    const [email, consent, timestamp, token] = line.split(',');
    return { email, consent, timestamp, token };
  });

  res.render('admin/panel', { users });
});



// 📄 Προβολή πίνακα email
router.get('/admin/panel', (req, res) => {
  const lines = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n');
  const header = lines[0].split(',');
  const users = lines.slice(1).map(line => {
    const [email, consent, timestamp, token] = line.split(',');
    return { email, consent, timestamp, token };
  });

  res.render('admin/panel', { users });
});



module.exports = router;
