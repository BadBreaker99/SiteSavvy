const express = require('express');
const path = require('path');

const app = express();

// Ρυθμίσεις
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Στατικά αρχεία
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/templates', (req, res) => res.render('templates'));
app.get('/pricing', (req, res) => res.render('pricing'));
app.get('/contact', (req, res) => res.render('contact'));

// Εκκίνηση
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
