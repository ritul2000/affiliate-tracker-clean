# Affiliate Tracker System

A basic affiliate tracking system built for SYR Mediaworks.

## Features
- Admin Panel with dashboard
- Offer management
- Publisher management
- Unique tracking link generation
- Click tracking system
- Conversion tracking
- Reports (offer-wise & publisher-wise)
- Publisher login & dashboard
- Authentication & Authorization

## Tech Stack
- Node.js + Express
- MySQL Database
- EJS Templates
- Bootstrap 5
- bcryptjs
- UUID

## How to Run
1. Clone the repository
2. Run `npm install`
3. Setup MySQL database
4. Configure `.env` file
5. Run `node app.js`




# Enterprise Affiliate Tracker (Node.js & BullMQ)

A highly scalable affiliate tracking platform featuring a real-time Server-to-Server (S2S) postback system. 

To ensure maximum uptime and zero dropped conversions, the `/postback` webhook is decoupled from the database. Requests are instantly acknowledged and queued using Redis, while a background worker handles fraud validation (duplicate click blocking), MySQL inserts, and publisher webhooks with automated retries.

## 🛠️ Prerequisites
To run this project locally, you must have the following installed on your machine:
* **Node.js** (v18+)
* **MySQL** (Ensure your local MySQL server is running)
* **Redis (v5.0 or higher)** *(CRITICAL: BullMQ requires Redis Streams, which are not available in older versions).*

## 🚀 Local Setup Instructions

### 1. Clone the repository and install dependencies
```bash
git clone <your-github-repo-link>
cd affiliate-tracker
npm install