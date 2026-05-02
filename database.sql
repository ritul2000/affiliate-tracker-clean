-- CREATE DATABASE IF NOT EXISTS affiliate_tracker;
-- USE affiliate_tracker;

-- -- ================= ADMINS =================
-- CREATE TABLE admins (
-- id INT AUTO_INCREMENT PRIMARY KEY,
-- username VARCHAR(100) NOT NULL,
-- password VARCHAR(255) NOT NULL
-- );

-- -- ================= PUBLISHERS =================
-- CREATE TABLE publishers (
-- id INT AUTO_INCREMENT PRIMARY KEY,
-- name VARCHAR(100) NOT NULL,
-- email VARCHAR(100) UNIQUE NOT NULL,
-- password VARCHAR(255) NOT NULL,
-- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- ================= OFFERS =================
-- CREATE TABLE offers (
-- id INT AUTO_INCREMENT PRIMARY KEY,
-- name VARCHAR(200) NOT NULL,
-- payout DECIMAL(10,2) NOT NULL,
-- category VARCHAR(100),
-- model VARCHAR(50) DEFAULT 'CPA',
-- status ENUM('Active','Inactive') DEFAULT 'Active',
-- client_url VARCHAR(500) NOT NULL,   -- ✅ REQUIRED
-- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- ================= PUBLISHER OFFERS =================
-- CREATE TABLE publisher_offers (
-- id INT AUTO_INCREMENT PRIMARY KEY,
-- publisher_id INT,
-- offer_id INT,
-- tracking_link VARCHAR(500),
-- assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- FOREIGN KEY (publisher_id) REFERENCES publishers(id),
-- FOREIGN KEY (offer_id) REFERENCES offers(id)
-- );

-- -- ================= CLICKS =================
-- CREATE TABLE clicks (
-- id INT AUTO_INCREMENT PRIMARY KEY,
-- publisher_id INT,
-- offer_id INT,
-- click_id VARCHAR(100) UNIQUE,   -- ✅ MUST BE UNIQUE
-- ip_address VARCHAR(50),
-- source VARCHAR(100),            -- ✅ REQUIRED
-- p1 VARCHAR(100),                -- ✅ OPTIONAL
-- p2 VARCHAR(100),                -- ✅ OPTIONAL
-- p3 VARCHAR(100),                -- ✅ OPTIONAL
-- clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- FOREIGN KEY (publisher_id) REFERENCES publishers(id),
-- FOREIGN KEY (offer_id) REFERENCES offers(id)
-- );

-- -- ================= CONVERSIONS =================
-- CREATE TABLE conversions (
-- id INT AUTO_INCREMENT PRIMARY KEY,
-- click_id VARCHAR(100) UNIQUE,
-- publisher_id INT,
-- offer_id INT,
-- converted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- FOREIGN KEY (publisher_id) REFERENCES publishers(id),
-- FOREIGN KEY (offer_id) REFERENCES offers(id)
-- );

-- -- ================= POSTBACK LOGS =================
-- CREATE TABLE postback_logs (
-- id INT AUTO_INCREMENT PRIMARY KEY,
-- click_id VARCHAR(100),
-- offer_id INT,
-- status VARCHAR(50),
-- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- ================= SAMPLE DATA =================

-- -- Admin (password: password)
-- INSERT INTO admins (username, password)
-- VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- -- Publisher
-- INSERT INTO publishers (name, email, password)
-- VALUES ('Test Publisher', '[publisher@gmail.com](mailto:publisher@gmail.com)', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- -- Offers (WITH client_url)
-- INSERT INTO offers (name, payout, category, model, status, client_url)
-- VALUES
-- ('Bajaj Demat', 120.00, 'Business', 'CPA', 'Active',
-- 'https://example.com?click_id={click_id}&pub_id={pub_id}&source={source}'),

-- ('IDFC First Savings', 350.00, 'Business', 'CPA', 'Active',
-- 'https://example.com?click_id={click_id}&pub_id={pub_id}&source={source}'),

-- ('Naukari Career CPR', 20.00, 'Business', 'CPL', 'Active',
-- 'https://example.com?click_id={click_id}&pub_id={pub_id}&source={source}');

-- -- Tracking Link (NO click_id here)
-- INSERT INTO publisher_offers (publisher_id, offer_id, tracking_link)
-- VALUES (1, 1, 'http://localhost:3000/track?offer_id=1&pub_id=1');























CREATE DATABASE IF NOT EXISTS affiliate_tracker;
USE affiliate_tracker;

-- ADMINS
CREATE TABLE admins (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(100),
password VARCHAR(255)
);

-- PUBLISHERS
CREATE TABLE publishers (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100) UNIQUE,
password VARCHAR(255),
total_earnings DECIMAL(10,2) DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OFFERS
CREATE TABLE offers (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(200),
payout DECIMAL(10,2),
category VARCHAR(100),
model VARCHAR(50),
status ENUM('Active','Inactive') DEFAULT 'Active',
client_url VARCHAR(500),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PUBLISHER OFFERS
CREATE TABLE publisher_offers (
id INT AUTO_INCREMENT PRIMARY KEY,
publisher_id INT,
offer_id INT,
tracking_link VARCHAR(500),
postback_url VARCHAR(500),
assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CLICKS
CREATE TABLE clicks (
id INT AUTO_INCREMENT PRIMARY KEY,
publisher_id INT,
offer_id INT,
click_id VARCHAR(100) UNIQUE,
ip_address VARCHAR(50),
source VARCHAR(100),
campaign_id INT,
is_unique TINYINT DEFAULT 1,
user_agent VARCHAR(500),
clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CONVERSIONS
CREATE TABLE conversions (
id INT AUTO_INCREMENT PRIMARY KEY,
click_id VARCHAR(100) UNIQUE,
publisher_id INT,
offer_id INT,
payout DECIMAL(10,2) DEFAULT 0,
status VARCHAR(50) DEFAULT 'approved',
converted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POSTBACK LOGS
CREATE TABLE postback_logs (
id INT AUTO_INCREMENT PRIMARY KEY,
click_id VARCHAR(100),
offer_id INT,
status VARCHAR(50),
postback_url VARCHAR(500),
response TEXT,
retry_count INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SAMPLE DATA
INSERT INTO admins (username, password)
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO publishers (name, email, password)
VALUES ('Test Publisher', 'publisher@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO offers (name, payout, category, model, status, client_url)
VALUES
('Bajaj Demat',120,'Business','CPA','Active',
'https://www.bajajbroking.in/?click_id={click_id}&pub_id={pub_id}&source={source}');

INSERT INTO publisher_offers (publisher_id, offer_id, tracking_link, postback_url)
VALUES (1,1,
'http://localhost:3000/track?offer_id=1&pub_id=1',
'http://localhost:3000/postback?click_id={click_id}&status=approved');
