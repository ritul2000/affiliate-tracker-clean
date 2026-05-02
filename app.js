// const express = require('express');
// const session = require('express-session');
// const path = require('path');
// require('dotenv').config();

// const app = express();

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//   secret: process.env.SESSION_SECRET || 'secret123',
//   resave: false,
//   saveUninitialized: false
// }));

// const adminRoutes = require('./routes/adminRoutes');
// const publisherRoutes = require('./routes/publisherRoutes');
// const trackingRoutes = require('./routes/trackingRoutes');

// app.use('/admin', adminRoutes);
// app.use('/publisher', publisherRoutes);
// app.use('/', trackingRoutes);

// app.get('/', (req, res) => res.redirect('/admin/login'));

// // ================= ADVERTISER PAGE =================
// app.get('/advertiser-page', (req, res) => {
//   const { click_id, source } = req.query;
//   res.send(`
//     <html>
//     <head>
//       <title>Advertiser Website</title>
//       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
//     </head>
//     <body class="p-5">
//       <div class="container">
//         <h2>🏦 Bajaj Broking - Open Demat Account</h2>
//         <div class="alert alert-info">
//           Tracking ID: <strong>${click_id}</strong><br>
//           Source: <strong>${source || 'organic'}</strong>
//         </div>
//         <div class="card p-4 mt-3">
//           <h4>Fill your details:</h4>
//           <input class="form-control mb-2" placeholder="Full Name">
//           <input class="form-control mb-2" placeholder="Email">
//           <input class="form-control mb-2" placeholder="Phone">
//           <button onclick="submitForm('${click_id}')"
//           class="btn btn-success btn-lg w-100 mt-2">
//             Submit & Open Account
//           </button>
//         </div>
//         <div id="result" class="mt-3"></div>
//       </div>
//       <script>
//       async function submitForm(clickId) {
//         document.getElementById('result').innerHTML =
//           '<div class="alert alert-warning">Processing your application...</div>';
//         try {
//           const response = await fetch(
//             '/fire-s2s-postback?click_id=' + clickId + '&payout=120&status=approved'
//           );
//           const text = await response.text();
//           document.getElementById('result').innerHTML =
//             '<div class="alert alert-success">' + text + '</div>';
//         } catch(err) {
//           document.getElementById('result').innerHTML =
//             '<div class="alert alert-danger">Error: ' + err.message + '</div>';
//         }
//       }
//       </script>
//     </body>
//     </html>
//   `);
// });

// // ================= S2S POSTBACK FIRE =================
// app.get('/fire-s2s-postback', async (req, res) => {
//   const { click_id, payout, status } = req.query;
//   const http = require('http');
//   const postbackUrl = `http://localhost:3000/postback?click_id=${click_id}&payout=${payout}&status=${status}`;
//   console.log('🔥 Advertiser SERVER firing S2S postback to:', postbackUrl);
//   http.get(postbackUrl, (response) => {
//     let data = '';
//     response.on('data', chunk => data += chunk);
//     response.on('end', () => {
//       console.log('✅ S2S Postback response:', data);
//       res.send(`
//         ✅ Account opened successfully!<br><br>
//         <strong>S2S Postback fired from server!</strong><br>
//         Postback URL: ${postbackUrl}<br>
//         Server Response: ${data}
//       `);
//     });
//   }).on('error', (err) => {
//     console.log('❌ S2S Postback failed:', err.message);
//     res.send('Postback failed: ' + err.message);
//   });
// });

// // ================= SERVER =================
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });





























const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// ================= VIEW ENGINE =================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ================= SESSION =================
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false
}));

// ================= ROUTES =================
const adminRoutes = require('./routes/adminRoutes');
const publisherRoutes = require('./routes/publisherRoutes');
const trackingRoutes = require('./routes/trackingRoutes');

app.use('/admin', adminRoutes);
app.use('/publisher', publisherRoutes);

// IMPORTANT: tracking routes at root
app.use('/', trackingRoutes);

// ================= HOME =================
app.get('/', (req, res) => {
  res.redirect('/admin/login');
});

// ================= ERROR HANDLER =================
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});