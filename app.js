const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
require('dotenv').config();

const templates = require('./data/templates');
const routes = require('./routes'); // central index.js route file (προτείνεται να το φτιάξεις)
const sendAppointment = require('./routes/send-appointment');
const newsletterRoutes = require('./routes/api/newsletter');
const unsubscribeRoute = require('./routes/api/unsubscribe');

const app = express();

// 🧠 Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 🧠 View engine (EJS + ejs-mate layout support)
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🧠 Session config (change secret in production)
app.use(session({
  secret: process.env.SESSION_SECRET || '3159', // ✅ move to .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 30 // 30 minutes
  }
}));

// ✅ Routes (in correct order)

// 1. Admin-related routes
app.use('/', require('./routes/admin/register'));
app.use('/', require('./routes/admin/login'));
app.use('/', require('./routes/admin/verify'));
app.use('/', require('./routes/admin/panel'));
app.use('/', require('./routes/admin/unsubscribe'));

// 2. API routes
app.use('/api', newsletterRoutes);
app.use('/api', unsubscribeRoute);

// 3. Custom routes
app.use(sendAppointment);

// 4. Static pages
app.get('/', (req, res) => {
  res.render('index', { title: 'Αρχική', query: req.query });
});

app.get('/newsletter', (req, res) => {
  res.render('newsletter', { title: 'Newsletter' });
});

app.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy', { title: 'Πολιτική Απορρήτου' });
});

app.get('/templates', (req, res) => {
  res.render('templates', { title: 'Templates', templates });
});

app.get('/preview/:template', (req, res) => {
  res.render(`previews/${req.params.template}`, {
    title: `Προεπισκόπηση ${req.params.template}`
  });
});

// ✅ Server start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('[BASE_URL]', process.env.APP_BASE_URL);
});
