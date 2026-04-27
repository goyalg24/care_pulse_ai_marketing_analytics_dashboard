import { Database } from 'bun:sqlite';

const db = new Database('marketing.db');
db.run('PRAGMA foreign_keys = ON;');

console.log('🌱 Starting database seed...');

const adminHash = await Bun.password.hash('password123');
const analystHash = await Bun.password.hash('password123');

try {
  db.run('DELETE FROM ai_conversations');
  db.run('DELETE FROM analytics_reports');
  db.run('DELETE FROM campaigns');
  db.run('DELETE FROM customer_segments');
  db.run('DELETE FROM users');

  db.run(`INSERT INTO users (name, email, password_hash, role) VALUES
    ('Admin User', 'admin@carepulse.com', ?, 'admin'),
    ('Analyst User', 'analyst@carepulse.com', ?, 'analyst')`, [adminHash, analystHash]);

  db.run(`INSERT INTO customer_segments (name, description, criteria, created_by) VALUES
    ('High-Risk Chronic Care', 'Patients over 50 with low engagement', '{"region":"National","risk":"High","age_band":"50+"}', 1),
    ('Preventive Wellness', 'Routine wellness candidates', '{"region":"Southeast","care_type":"Preventive"}', 2)`);

  db.run(`INSERT INTO campaigns (title, description, channel, start_date, end_date, owner_id) VALUES
    ('Diabetes Awareness Spring', 'Email outreach for chronic care awareness', 'Email', '2026-04-01', '2026-05-15', 2),
    ('Cardio Follow-Up Outreach', 'Search retargeting campaign for cardio patients', 'Paid Search', '2026-04-10', '2026-05-31', 1)`);

  db.run(`INSERT INTO analytics_reports (campaign_id, segment_id, metrics_data) VALUES
    (1, 1, '{"impressions":25000,"clicks":2800,"conversions":310,"revenue":14000}'),
    (2, 2, '{"impressions":40000,"clicks":3500,"conversions":290,"revenue":16800}')`);

  db.run(`INSERT INTO ai_conversations (user_id, prompt, response) VALUES
    (2, 'Which segment should receive more budget next month?', 'Medication Adherence should be prioritized because it has the highest priority score and strong response rate.')`);

  console.log('✅ Database seeded successfully.');
  console.log('Admin: admin@carepulse.com / password123');
  console.log('Analyst: analyst@carepulse.com / password123');
} catch (error) {
  console.error('❌ Seeding failed:', error.message);
}
