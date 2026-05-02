const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
  res.render('publisher/login', { error: null });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM publishers WHERE email = ?', [email]);
    if (rows.length === 0) return res.render('publisher/login', { error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) return res.render('publisher/login', { error: 'Invalid credentials' });
    req.session.publisher = rows[0];
    res.redirect('/publisher/dashboard');
  } catch (err) {
    res.render('publisher/login', { error: 'Something went wrong' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/publisher/login');
};

exports.getDashboard = async (req, res) => {
  const publisherId = req.session.publisher.id;
  try {
    const [offers] = await db.query(`
      SELECT po.*, o.name as offer_name, o.payout, o.model
      FROM publisher_offers po
      JOIN offers o ON po.offer_id = o.id
      WHERE po.publisher_id = ?
    `, [publisherId]);
    const [[{ totalClicks }]] = await db.query(
      'SELECT COUNT(*) as totalClicks FROM clicks WHERE publisher_id = ?', [publisherId]);
    const [[{ totalConversions }]] = await db.query(
      'SELECT COUNT(*) as totalConversions FROM conversions WHERE publisher_id = ?', [publisherId]);
    res.render('publisher/dashboard', {
      publisher: req.session.publisher,
      offers, totalClicks, totalConversions
    });
  } catch (err) {
    res.send('Error loading publisher dashboard');
  }
};