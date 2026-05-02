const db = require('../config/db');
const crypto = require('crypto');
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null
});

const postbackQueue = new Queue('postbackQueue', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 }
  }
});

/* ================= CLICK ================= */
exports.trackClick = async (req, res) => {
  try {
    const { offer_id, pub_id, source = 'direct' } = req.query;

    if (!offer_id || !pub_id) {
      return res.send("Missing parameters");
    }

    const click_id = crypto.randomBytes(16).toString('hex');

    await db.query(
      `INSERT INTO clicks (publisher_id, offer_id, click_id, ip_address, source)
       VALUES (?, ?, ?, ?, ?)`,
      [pub_id, offer_id, click_id, req.ip, source]
    );

    const [offer] = await db.query(
      `SELECT client_url FROM offers WHERE id=?`,
      [offer_id]
    );

    if (!offer.length || !offer[0].client_url) {
      return res.send("Offer URL not found");
    }

    let url = offer[0].client_url
      .replace('{click_id}', click_id)
      .replace('{pub_id}', pub_id)
      .replace('{source}', source);

    console.log("\n✅ CLICK TRACKED");
    console.log("Click ID:", click_id);
    console.log("Redirect →", url);

    res.redirect(url);

  } catch (err) {
    console.log("❌ Click Error:", err.message);
    res.send("Error");
  }
};


/* ================= POSTBACK ================= */
exports.trackPostback = async (req, res) => {
  try {
    const { click_id, payout = 0, status = 'approved' } = req.query;

    if (!click_id) {
      return res.status(400).send("No click_id");
    }

    await postbackQueue.add('postback', { click_id, payout, status });

    return res.status(200).send("OK");

  } catch (err) {
    console.log("❌ Postback enqueue error:", err.message);
    return res.status(500).send("Error");
  }
};
