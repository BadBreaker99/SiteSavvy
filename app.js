const express = require('express');
const path = require('path');
const templates = require('./data/templates');
require('dotenv').config();
const sendAppointment = require('./routes/send-appointment');

const newsletterRoutes = require('./routes/api/newsletter');
const unsubscribeRoute = require('./routes/api/unsubscribe');






const ejsMate = require('ejs-mate'); // ✅ αυτό έλειπε

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('ejs', ejsMate); // ✅ σωστό engine τώρα
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Routes
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

console.log('[BASE_URL]', process.env.APP_BASE_URL);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
