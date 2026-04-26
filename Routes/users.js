import db from "../db";

app.get("/users", (req, res) => {
  // Bun's syntax is slightly different than pg
  const users = db.query("SELECT * FROM users").all();
  res.json(users);
});