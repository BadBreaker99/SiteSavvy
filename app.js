const express = require('express');
const path = require('path');
const templates = require('./data/templates');
require('dotenv').config();
const sendAppointment = require('./routes/send-appointment');

const { v4: uuidv4 } = require('uuid');
const id = uuidv4();


const newsletterRoutes = require('./routes/api/newsletter');
const unsubscribeRoute = require('./routes/api/unsubscribe');






const ejsMate = require('ejs-mate'); // ✅ αυτό έλειπε

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/admin/register'));
app.use('/', require('./routes/admin/verify'));

app.engine('ejs', ejsMate); // ✅ σωστό engine τώρα
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Routes
const session = require('express-session');

app.use(session({
  secret: '3159', // ⚠️ άλλαξέ το!
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 30 // 30 λεπτά
  }
}));
app.use('/', require('./routes/admin/login'));

app.use('/', require('./routes/admin/panel'));
app.use('/', require('./routes/admin/unsubscribe'));
app.get('/admin/register', (req, res) => {
  res.render('admin/register', { title: 'Εγγραφή Admin' });
});


app.get('/templates', (req, res) => res.render('templates', { title: 'Templates', templates }));
app.use('/', unsubscribeRoute);
app.use('/', newsletterRoutes);
app.get('/preview/:template', (req, res) => {
  res.render(`previews/${req.params.template}`, {
    title: `Προεπισκόπηση ${req.params.template}`
  });
});
app.get('/newsletter', (req, res) => {
  res.render('newsletter', { title: 'Newsletter' });
});
app.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy', { title: 'Πολιτική Απορρήτου' });
});
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Αρχική',
    query: req.query, // ✅ ΠΕΡΝΑ ΤΟ QUERY
  });
});
app.use(sendAppointment);
app.use('/', require('./routes/admin/register'));
console.log('[BASE_URL]', process.env.APP_BASE_URL);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
