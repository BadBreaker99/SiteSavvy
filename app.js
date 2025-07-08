// === app.js ===
const express = require('express');
const path = require('path');
const templates = require('./data/templates');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index', { title: "Αρχική" }));
app.get('/templates', (req, res) => res.render('templates', { title: "Templates", templates }));
app.get('/pricing', (req, res) => res.render('pricing', { title: "Τιμές" }));
app.get('/contact', (req, res) => res.render('contact', { title: "Επικοινωνία" }));
app.get('/preview/:template', (req, res) => {
  res.render(`previews/${req.params.template}`, {
    title: `Προεπισκόπηση ${req.params.template}`
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔧 Server running at http://localhost:${PORT}`);
});