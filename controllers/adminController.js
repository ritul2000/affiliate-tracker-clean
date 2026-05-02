// const db = require('../config/db');
// const bcrypt = require('bcryptjs');
// const { v4: uuidv4 } = require('uuid');

// exports.getLogin = (req, res) => {
//   res.render('admin/login', { error: null });
// };

// exports.postLogin = async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
//     if (rows.length === 0) return res.render('admin/login', { error: 'Invalid credentials' });
//     const match = await bcrypt.compare(password, rows[0].password);
//     if (!match) return res.render('admin/login', { error: 'Invalid credentials' });
//     req.session.admin = rows[0];
//     res.redirect('/admin/dashboard');
//   } catch (err) {
//     res.render('admin/login', { error: 'Something went wrong' });
//   }
// };

// exports.logout = (req, res) => {
//   req.session.destroy();
//   res.redirect('/admin/login');
// };

// exports.getDashboard = async (req, res) => {
//   try {
//     const [[{ totalClicks }]] = await db.query('SELECT COUNT(*) as totalClicks FROM clicks');
//     const [[{ totalConversions }]] = await db.query('SELECT COUNT(*) as totalConversions FROM conversions');
//     const [[{ totalOffers }]] = await db.query('SELECT COUNT(*) as totalOffers FROM offers');
//     const [[{ totalPublishers }]] = await db.query('SELECT COUNT(*) as totalPublishers FROM publishers');
//     res.render('admin/dashboard', {
//       totalClicks,
//       totalConversions,
//       totalOffers,
//       totalPublishers
//     });
//   } catch (err) {
//     res.send('Error loading dashboard');
//   }
// };

// exports.getOffers = async (req, res) => {
//   try {
//     const [offers] = await db.query('SELECT * FROM offers ORDER BY id DESC');
//     res.render('admin/offers', { offers });
//   } catch (err) {
//     res.send('Error loading offers');
//   }
// };

// exports.addOffer = async (req, res) => {
//   const { name, payout, category, model, status, offer_url } = req.body;
//   try {
//     console.log('Form data received:', req.body);
//     await db.query(
//       'INSERT INTO offers (name, payout, category, model, status, offer_url) VALUES (?, ?, ?, ?, ?, ?)',
//       [name, payout, category, model, status, offer_url]
//     );
//     res.redirect('/admin/offers');
//   } catch (err) {
//     console.log('EXACT ERROR:', err.message);
//     res.send('Error: ' + err.message);
//   }
// };

// exports.editOffer = async (req, res) => {
//   const { id, name, payout, category, model, status, offer_url } = req.body;
//   try {
//     await db.query(
//       'UPDATE offers SET name=?, payout=?, category=?, model=?, status=?, offer_url=? WHERE id=?',
//       [name, payout, category, model, status, offer_url, id]
//     );
//     res.redirect('/admin/offers');
//   } catch (err) {
//     console.log('EXACT EDIT ERROR:', err.message);
//     res.send('Error editing offer: ' + err.message);
//   }
// };

// exports.getEditOffer = async (req, res) => {
//   try {
//     const [offers] = await db.query(
//       'SELECT * FROM offers WHERE id = ?',
//       [req.params.id]
//     );
//     if (offers.length === 0) return res.send('Offer not found');
//     res.render('admin/edit-offer', { offer: offers[0] });
//   } catch (err) {
//     res.send('Error loading offer');
//   }
// };

// exports.deleteOffer = async (req, res) => {
//   try {
//     await db.query('DELETE FROM offers WHERE id = ?', [req.params.id]);
//     res.redirect('/admin/offers');
//   } catch (err) {
//     res.send('Error deleting offer');
//   }
// };

// exports.getPublishers = async (req, res) => {
//   try {
//     const [publishers] = await db.query('SELECT * FROM publishers ORDER BY id DESC');
//     res.render('admin/publishers', { publishers });
//   } catch (err) {
//     res.send('Error loading publishers');
//   }
// };

// exports.addPublisher = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hashed = await bcrypt.hash(password, 10);
//     await db.query(
//       'INSERT INTO publishers (name, email, password) VALUES (?, ?, ?)',
//       [name, email, hashed]
//     );
//     res.redirect('/admin/publishers');
//   } catch (err) {
//     res.send('Error adding publisher');
//   }
// };

// exports.deletePublisher = async (req, res) => {
//   try {
//     await db.query('DELETE FROM publishers WHERE id = ?', [req.params.id]);
//     res.redirect('/admin/publishers');
//   } catch (err) {
//     res.send('Error deleting publisher');
//   }
// };

// exports.getAssign = async (req, res) => {
//   try {
//     const [publishers] = await db.query('SELECT * FROM publishers');
//     const [offers] = await db.query('SELECT * FROM offers WHERE status = "Active"');
//     const [assignments] = await db.query(`
//       SELECT po.*, p.name as publisher_name, o.name as offer_name
//       FROM publisher_offers po
//       JOIN publishers p ON po.publisher_id = p.id
//       JOIN offers o ON po.offer_id = o.id
//       ORDER BY po.id DESC
//     `);
//     res.render('admin/assign', { publishers, offers, assignments });
//   } catch (err) {
//     res.send('Error loading assign page');
//   }
// };

// exports.postAssign = async (req, res) => {
//   const { publisher_id, offer_id } = req.body;
//   try {
//     const trackingLink = `http://localhost:3000/track?offer_id=${offer_id}&pub_id=${publisher_id}`;
//     await db.query(
//       'INSERT INTO publisher_offers (publisher_id, offer_id, tracking_link) VALUES (?, ?, ?)',
//       [publisher_id, offer_id, trackingLink]
//     );
//     res.redirect('/admin/assign');
//   } catch (err) {
//     console.log(err);
//     res.send('Error assigning offer');
//   }
// };

// exports.getReports = async (req, res) => {
//   try {
//     const [clicks] = await db.query(`
//       SELECT c.*, p.name as publisher_name, o.name as offer_name
//       FROM clicks c
//       JOIN publishers p ON c.publisher_id = p.id
//       JOIN offers o ON c.offer_id = o.id
//       ORDER BY c.clicked_at DESC
//     `);
//     const [conversions] = await db.query(`
//       SELECT cv.*, p.name as publisher_name, o.name as offer_name
//       FROM conversions cv
//       JOIN publishers p ON cv.publisher_id = p.id
//       JOIN offers o ON cv.offer_id = o.id
//       ORDER BY cv.converted_at DESC
//     `);
//     res.render('admin/reports', { clicks, conversions });
//   } catch (err) {
//     res.send('Error loading reports');
//   }
// };
































const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// ================= AUTH =================
exports.getLogin = (req, res) => {
  res.render('admin/login', { error: null });
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) return res.render('admin/login', { error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) return res.render('admin/login', { error: 'Invalid credentials' });

    req.session.admin = rows[0];
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.render('admin/login', { error: 'Something went wrong' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
};

// ================= DASHBOARD =================
exports.getDashboard = async (req, res) => {
  try {
    const [[{ totalClicks }]] = await db.query('SELECT COUNT(*) as totalClicks FROM clicks');
    const [[{ totalConversions }]] = await db.query('SELECT COUNT(*) as totalConversions FROM conversions');
    const [[{ totalOffers }]] = await db.query('SELECT COUNT(*) as totalOffers FROM offers');
    const [[{ totalPublishers }]] = await db.query('SELECT COUNT(*) as totalPublishers FROM publishers');

    res.render('admin/dashboard', {
      totalClicks,
      totalConversions,
      totalOffers,
      totalPublishers
    });
  } catch (err) {
    res.send('Error loading dashboard');
  }
};

// ================= OFFERS =================
exports.getOffers = async (req, res) => {
  try {
    const [offers] = await db.query('SELECT * FROM offers ORDER BY id DESC');
    res.render('admin/offers', { offers });
  } catch (err) {
    res.send('Error loading offers');
  }
};

// ✅ FIXED ADD OFFER
exports.addOffer = async (req, res) => {
  const { name, payout, category, model, status, client_url } = req.body;

  try {
    await db.query(
      'INSERT INTO offers (name, payout, category, model, status, client_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, payout, category, model, status, client_url]
    );

    res.redirect('/admin/offers');
  } catch (err) {
    console.log('ADD ERROR:', err.message);
    res.send('Error: ' + err.message);
  }
};

// ✅ FIXED EDIT OFFER
exports.editOffer = async (req, res) => {
  const { id, name, payout, category, model, status, client_url } = req.body;

  try {
    await db.query(
      'UPDATE offers SET name=?, payout=?, category=?, model=?, status=?, client_url=? WHERE id=?',
      [name, payout, category, model, status, client_url, id]
    );

    res.redirect('/admin/offers');
  } catch (err) {
    console.log('EDIT ERROR:', err.message);
    res.send('Error editing offer: ' + err.message);
  }
};

exports.getEditOffer = async (req, res) => {
  try {
    const [offers] = await db.query(
      'SELECT * FROM offers WHERE id = ?',
      [req.params.id]
    );

    if (offers.length === 0) return res.send('Offer not found');

    res.render('admin/edit-offer', { offer: offers[0] });
  } catch (err) {
    res.send('Error loading offer');
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    await db.query('DELETE FROM postback_logs WHERE offer_id = ?', [req.params.id]);
    await db.query('DELETE FROM conversions WHERE offer_id = ?', [req.params.id]);
    await db.query('DELETE FROM clicks WHERE offer_id = ?', [req.params.id]);
    await db.query('DELETE FROM publisher_offers WHERE offer_id = ?', [req.params.id]);
    await db.query('DELETE FROM offers WHERE id = ?', [req.params.id]);

    res.redirect('/admin/offers');
  } catch (err) {
    console.log('Delete error:', err.message);
    res.send('Error deleting offer: ' + err.message);
  }
};

// ================= PUBLISHERS =================
exports.getPublishers = async (req, res) => {
  try {
    const [publishers] = await db.query('SELECT * FROM publishers ORDER BY id DESC');
    res.render('admin/publishers', { publishers });
  } catch (err) {
    res.send('Error loading publishers');
  }
};

exports.addPublisher = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO publishers (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );

    res.redirect('/admin/publishers');
  } catch (err) {
    res.send('Error adding publisher');
  }
};

exports.deletePublisher = async (req, res) => {
  try {
    await db.query('DELETE FROM conversions WHERE publisher_id = ?', [req.params.id]);
    await db.query('DELETE FROM clicks WHERE publisher_id = ?', [req.params.id]);
    await db.query('DELETE FROM publisher_offers WHERE publisher_id = ?', [req.params.id]);
    await db.query('DELETE FROM publishers WHERE id = ?', [req.params.id]);

    res.redirect('/admin/publishers');
  } catch (err) {
    res.send('Error deleting publisher: ' + err.message);
  }
};

// ================= ASSIGN =================
exports.getAssign = async (req, res) => {
  try {
    const [publishers] = await db.query('SELECT * FROM publishers');
    const [offers] = await db.query('SELECT * FROM offers WHERE status = "Active"');

    const [assignments] = await db.query(`
      SELECT po.*, p.name as publisher_name, o.name as offer_name
      FROM publisher_offers po
      JOIN publishers p ON po.publisher_id = p.id
      JOIN offers o ON po.offer_id = o.id
      ORDER BY po.id DESC
    `);

    res.render('admin/assign', { publishers, offers, assignments });
  } catch (err) {
    res.send('Error loading assign page');
  }
};

exports.postAssign = async (req, res) => {
  const { publisher_id, offer_id } = req.body;

  try {
    const trackingLink = `http://localhost:3000/track?offer_id=${offer_id}&pub_id=${publisher_id}&source={source}`;

    await db.query(
      'INSERT INTO publisher_offers (publisher_id, offer_id, tracking_link) VALUES (?, ?, ?)',
      [publisher_id, offer_id, trackingLink]
    );

    res.redirect('/admin/assign');
  } catch (err) {
    console.log(err);
    res.send('Error assigning offer');
  }
};

// ================= REPORTS =================
exports.getReports = async (req, res) => {
  try {
    const [clicks] = await db.query(`
      SELECT c.*, p.name as publisher_name, o.name as offer_name
      FROM clicks c
      JOIN publishers p ON c.publisher_id = p.id
      JOIN offers o ON c.offer_id = o.id
      ORDER BY c.clicked_at DESC
    `);

    const [conversions] = await db.query(`
      SELECT cv.*, p.name as publisher_name, o.name as offer_name
      FROM conversions cv
      JOIN publishers p ON cv.publisher_id = p.id
      JOIN offers o ON cv.offer_id = o.id
      ORDER BY cv.converted_at DESC
    `);

    const [postbackLogs] = await db.query(`
      SELECT * FROM postback_logs
      ORDER BY created_at DESC
      LIMIT 50
    `);

    res.render('admin/reports', {
      clicks,
      conversions,
      postbackLogs
    });

  } catch (err) {
    console.log('Reports error:', err.message);
    res.send('Error loading reports: ' + err.message);
  }
};