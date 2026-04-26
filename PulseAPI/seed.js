import { Database } from "bun:sqlite";

const db = new Database("marketing.db");

// 1. Always enable foreign keys so the script respects your rules
db.run("PRAGMA foreign_keys = ON;");

console.log("🌱 Starting Database Seed...");

try {
  // 2. Create a Dummy User (The 'Parent' for almost everything)
  db.run(`INSERT INTO users (name, email, password_hash, role) 
          VALUES ('Test User', 'test@example.com', 'dummy_hash', 'admin')`);
  
  // 3. Create a Customer Segment (Requires a User)
  db.run(`INSERT INTO customer_segments (name, description, criteria, created_by) 
          VALUES ('High Value', 'Customers who spent > $500', '{"min_spend": 500}', 1)`);

  // 4. Create a Campaign (Requires a User)
  db.run(`INSERT INTO campaigns (title, description, channel, start_date, end_date, owner_id) 
          VALUES ('Summer Sale', '20% off site-wide', 'Email', '2026-06-01', '2026-06-30', 1)`);

  // 5. Create an Analytics Report (Requires a Campaign AND a Segment)
  db.run(`INSERT INTO analytics_reports (campaign_id, segment_id, metrics_data) 
          VALUES (1, 1, '{"clicks": 1200, "conversions": 45, "revenue": 2200}')`);

  // 6. Create an AI Conversation (Requires a User)
  db.run(`INSERT INTO ai_conversations (user_id, prompt, response) 
          VALUES (1, 'What is the best time to send emails?', 'According to data, Tuesday at 10 AM.')`);

  console.log("✅ Database seeded successfully! Your tables are ready for the frontend.");
} catch (error) {
  console.error("❌ Seeding failed:", error.message);
  console.log("Tip: If you get a 'UNIQUE constraint' error, the data is already there!");
}