const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const CSV_PATH = path.join(process.cwd(), 'data', 'newsletter.csv');

router.post('/admin/unsubscribe', (req, res) => {
  if (!req.session.adminId) return res.redirect('/admin/login');

  const { token } = req.body;
  if (!token) return res.status(400).send('Λείπει token.');

  const lines = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n');
  const header = lines[0];
  const filtered = lines.filter(line => !line.endsWith(token));
  fs.writeFileSync(CSV_PATH, [header, ...filtered.slice(1)].join('\n') + '\n');

  res.redirect('/admin/panel');
});

module.exports = router;
