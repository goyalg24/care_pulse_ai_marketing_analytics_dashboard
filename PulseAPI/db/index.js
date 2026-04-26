import { Database } from "bun:sqlite";

const db = new Database("marketing.db");
// Crucial for your ON DELETE CASCADE to work
db.run("PRAGMA foreign_keys = ON;");

export default db;