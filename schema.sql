
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  featured INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO settings(key,value) VALUES
('hero_title','Turn Your Memories Into Art.'),
('hero_text','Beautiful frames, wall art and personalized pieces designed for every memory and every wall.'),
('whatsapp','919205871232'),
('delivery_text','Fast & reliable delivery'),
('contact_text','Tell us what you want to frame.'),
('location_address','Sultan Market, opposite Shakuntala School, Kampil Road, Kaimganj, Farrukhabad, Uttar Pradesh 209502, India'),
('maps_url','https://www.google.com/maps/search/?api=1&query=Sultan%20Market%2C%20opposite%20Shakuntala%20School%2C%20Kampil%20Road%2C%20Kaimganj%2C%20Farrukhabad%2C%20Uttar%20Pradesh%20209502%2C%20India');
