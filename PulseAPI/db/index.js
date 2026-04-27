import { Database } from 'bun:sqlite';

const db = new Database('marketing.db');
db.run('PRAGMA foreign_keys = ON;');

export default db;
