const db = require('./config/db');
const IORedis = require('ioredis');
const { Worker, Queue } = require('bullmq');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null
});

new Queue('postbackQueue', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 }
  }
});

const worker = new Worker(
  'postbackQueue',
  async (job) => {
    const { click_id, payout = 0, status = 'approved' } = job.data;

    console.log(`\n🔥 Processing job ${job.id} | click_id=${click_id}`);

    // 1. Validation: click must exist
    const [click] = await db.query(
      `SELECT * FROM clicks WHERE click_id=?`,
      [click_id]
    );

    if (!click.length) {
      throw new Error(`Invalid click_id: ${click_id}`);
    }

    // 2. Fraud prevention: skip if conversion already exists
    const [exists] = await db.query(
      `SELECT id FROM conversions WHERE click_id=?`,
      [click_id]
    );

    if (exists.length) {
      console.log(`⚠️ Duplicate conversion blocked for click_id=${click_id}`);
      return;
    }

    // 3. Record conversion
    await db.query(
      `INSERT INTO conversions (click_id, publisher_id, offer_id, payout, status)
       VALUES (?, ?, ?, ?, ?)`,
      [click_id, click[0].publisher_id, click[0].offer_id, payout, status]
    );

    console.log("✅ Conversion saved");

    // 4. Fetch publisher postback URL
    const [pbs] = await db.query(
      `SELECT postback_url FROM publisher_offers
       WHERE publisher_id=? AND offer_id=?`,
      [click[0].publisher_id, click[0].offer_id]
    );

    for (const pb of pbs) {
      if (!pb.postback_url) continue;

      // 5. Macro replacement
      const url = pb.postback_url
        .replace('{click_id}', click_id)
        .replace('{payout}', payout)
        .replace('{status}', status);

      console.log("📡 Firing postback:", url);

      // 6. Fire webhook
      try {
        const r = await fetch(url);
        const txt = await r.text();

        if (!r.ok) {
          throw new Error(`HTTP ${r.status}: ${txt}`);
        }

        // 7. Log success
        await db.query(
          `INSERT INTO postback_logs (click_id, offer_id, status, postback_url, response, retry_count)
           VALUES (?, ?, ?, ?, ?, 0)`,
          [click_id, click[0].offer_id, 'success', url, txt]
        );

        console.log("✅ Postback success:", txt);

      } catch (err) {
        await db.query(
          `INSERT INTO postback_logs (click_id, offer_id, status, postback_url, response, retry_count)
           VALUES (?, ?, ?, ?, ?, 1)`,
          [click_id, click[0].offer_id, 'failed', url, err.message]
        );

        console.log("❌ Postback failed:", err.message);
        throw err;
      }
    }
  },
  {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 }
    }
  }
);

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log(`❌ Job ${job?.id} failed (attempt ${job?.attemptsMade}): ${err.message}`);
});

console.log('👷 Worker started, listening on postbackQueue...');
