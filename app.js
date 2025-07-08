const express = require('express');
const path = require('path');
const templates = require('./data/templates.json');

const app = express();

// Settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => res.render('index', { title: "Αρχική" }));
app.get('/templates', (req, res) => res.render('templates', { title: "Templates", templates }));
app.get('/pricing', (req, res) => res.render('pricing', { title: "Τιμές" }));
app.get('/contact', (req, res) => res.render('contact', { title: "Επικοινωνία" }));
app.get('/preview/template1', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates/template1/index.html'));
});
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔧 Server running at http://localhost:${PORT}`);
});
