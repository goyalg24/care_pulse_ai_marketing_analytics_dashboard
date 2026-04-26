import express from "express";
import cors from "cors";
import { Database } from "bun:sqlite";

// 1. Initialize Database
const db = new Database("marketing.db");
db.run("PRAGMA foreign_keys = ON;");

// 2. Initialize Express
const app = express();

// 3. Middlewares (Must come BEFORE routes)
app.use(cors());
app.use(express.json());

// 4. Routes
// Test Route: Visit http://localhost:8080/ in your browser
app.get("/", (req, res) => {
  res.send("API is running!");
});

app.get("/api/campaigns", (req, res) => {
  try {
    const campaigns = db.query("SELECT * FROM campaigns").all();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Start Server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server launched at http://localhost:${PORT}`);
});