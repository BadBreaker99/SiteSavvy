const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const CSV_PATH = path.join(process.cwd(), 'data', 'newsletter.csv');
const LOG_PATH = path.join(process.cwd(), 'data', 'unsubscribed.log');

router.get('/unsubscribe', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Μη έγκυρο αίτημα: λείπει το token.');
  }

  const lines = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n');
  const header = lines[0];
  const filtered = [header];

  let found = false;
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts[3] !== token) {
      filtered.push(lines[i]);
    } else {
      found = true;
    }
  }

  if (!found) {
    return res.send(renderPage(false));
  }

  fs.writeFileSync(CSV_PATH, filtered.join('\n') + '\n');
  fs.appendFileSync(LOG_PATH, `${token},${new Date().toISOString()}\n`);
  return res.send(renderPage(true));
});

function renderPage(success) {
  return `
    <!DOCTYPE html>
    <html lang="el">
    <head>
      <meta charset="UTF-8">
      <title>Απεγγραφή Newsletter</title>
      <style>
        body { font-family: sans-serif; padding: 2rem; background: #f5f5f5; color: #333; }
        .container { max-width: 500px; margin: auto; background: white; padding: 2rem; border-radius: 8px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h2 { color: ${success ? '#0c730c' : 'darkred'}; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>${success ? '✅ Επιτυχής Απεγγραφή' : '❌ Δεν βρέθηκε η εγγραφή'}</h2>
        <p>${success
          ? 'Το email σου αφαιρέθηκε από τη λίστα μας.'
          : 'Η απεγγραφή απέτυχε ή έχει ήδη ολοκληρωθεί.'}</p>
      </div>
    </body>
    </html>`;
}

module.exports = router;
