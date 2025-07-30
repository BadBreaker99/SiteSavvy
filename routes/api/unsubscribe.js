const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const CSV_PATH = path.join(process.cwd(), 'data', 'newsletter.csv');

router.get('/unsubscribe', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Μη έγκυρο αίτημα: λείπει το token.');
  }

  const lines = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n');
  const header = lines[0];
  const filtered = lines.filter(line => !line.endsWith(token));

  if (filtered.length === lines.length) {
    return res.send(`
      <h2>❌ Δεν βρέθηκε η εγγραφή</h2>
      <p>Η απεγγραφή απέτυχε ή έχει ήδη ολοκληρωθεί.</p>
    `);
  }

  fs.writeFileSync(CSV_PATH, filtered.join('\n') + '\n');

  res.send(`
    <h2>✅ Επιτυχής Απεγγραφή</h2>
    <p>Το email σου αφαιρέθηκε από τη λίστα μας.</p>
  `);
});

module.exports = router;
