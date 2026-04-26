import express from "express";
import cors from "cors";
import { Database } from "bun:sqlite";

const app = express();
const db = new Database("marketing.db");
db.run("PRAGMA foreign_keys = ON;");

app.use(cors());
app.use(express.json());
// Add this right after your middlewares
app.get("/", (req, res) => {
  res.send("Server is alive! Use /api/campaigns to see data.");
});
// --- 1. USERS & AUTH ---

app.post("/api/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    const hash = await Bun.password.hash(password);
    try {
        const result = db.query("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?) RETURNING user_id").get(name, email, hash, role || 'user');
        res.status(201).json({ id: result.user_id, message: "User created" });
    } catch (e) { res.status(400).json({ error: "Email already registered" }); }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.query("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    
    const isMatch = await Bun.password.verify(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    
    res.json({ id: user.user_id, name: user.name, role: user.role });
});

app.get("/api/users/:id", (req, res) => {
    const user = db.query("SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?").get(req.params.id);
    user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

// --- 2. CAMPAIGNS ---

app.get("/api/campaigns", (req, res) => {
    const owner_id = req.query.owner_id;
    const sql = owner_id ? "SELECT * FROM campaigns WHERE owner_id = ?" : "SELECT * FROM campaigns";
    const data = owner_id ? db.query(sql).all(owner_id) : db.query(sql).all();
    res.json(data);
});

app.get("/api/campaigns/:id", (req, res) => {
    const campaign = db.query("SELECT * FROM campaigns WHERE campaign_id = ?").get(req.params.id);
    campaign ? res.json(campaign) : res.status(404).json({ error: "Campaign not found" });
});

app.post("/api/campaigns", (req, res) => {
    const { title, description, channel, start_date, end_date, owner_id } = req.body;
    db.run("INSERT INTO campaigns (title, description, channel, start_date, end_date, owner_id) VALUES (?, ?, ?, ?, ?, ?)", 
        [title, description, channel, start_date, end_date, owner_id]);
    res.status(201).json({ message: "Campaign saved" });
});

app.put("/api/campaigns/:id", (req, res) => {
    const { title, description, channel, start_date, end_date } = req.body;
    db.run("UPDATE campaigns SET title=?, description=?, channel=?, start_date=?, end_date=? WHERE campaign_id=?", 
        [title, description, channel, start_date, end_date, req.params.id]);
    res.json({ message: "Campaign updated" });
});

app.delete("/api/campaigns/:id", (req, res) => {
    db.run("DELETE FROM campaigns WHERE campaign_id = ?", [req.params.id]);
    res.json({ message: "Campaign deleted" });
});

// --- 3. CUSTOMER SEGMENTS ---

app.get("/api/segments", (req, res) => {
    const segments = db.query("SELECT * FROM customer_segments").all();
    res.json(segments.map(s => ({ ...s, criteria: JSON.parse(s.criteria || "{}") })));
});

app.post("/api/segments", (req, res) => {
    const { name, description, criteria, created_by } = req.body;
    db.run("INSERT INTO customer_segments (name, description, criteria, created_by) VALUES (?, ?, ?, ?)", 
        [name, description, JSON.stringify(criteria), created_by]);
    res.status(201).json({ message: "Segment created" });
});

app.delete("/api/segments/:id", (req, res) => {
    db.run("DELETE FROM customer_segments WHERE segment_id = ?", [req.params.id]);
    res.json({ message: "Segment deleted" });
});

// --- 4. ANALYTICS REPORTS ---

app.get("/api/reports", (req, res) => {
    const reports = db.query("SELECT * FROM analytics_reports").all();
    res.json(reports.map(r => ({ ...r, metrics_data: JSON.parse(r.metrics_data) })));
});

app.get("/api/reports/campaign/:campaign_id", (req, res) => {
    const reports = db.query("SELECT * FROM analytics_reports WHERE campaign_id = ?").all(req.params.campaign_id);
    res.json(reports.map(r => ({ ...r, metrics_data: JSON.parse(r.metrics_data) })));
});

app.post("/api/reports/generate", (req, res) => {
    const { campaign_id, segment_id, metrics_data } = req.body;
    db.run("INSERT INTO analytics_reports (campaign_id, segment_id, metrics_data) VALUES (?, ?, ?)", 
        [campaign_id, segment_id, JSON.stringify(metrics_data)]);
    res.status(201).json({ message: "Report generated" });
});

// --- 5. AI CONVERSATIONS ---

app.get("/api/ai/history/:user_id", (req, res) => {
    const history = db.query("SELECT * FROM ai_conversations WHERE user_id = ? ORDER BY timestamp DESC").all(req.params.user_id);
    res.json(history);
});

app.post("/api/ai/chat", async (req, res) => {
    const { user_id, prompt } = req.body;
    
    // Placeholder for your AI logic (e.g., OpenAI or Anthropic API call)
    const aiResponse = `This is a simulated AI response to: "${prompt}"`;
    
    db.run("INSERT INTO ai_conversations (user_id, prompt, response) VALUES (?, ?, ?)", 
        [user_id, prompt, aiResponse]);
    
    res.json({ response: aiResponse });
});

app.listen(8080, () => console.log("🚀 Full Marketing API running on http://localhost:8080"));