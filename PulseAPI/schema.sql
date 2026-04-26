-- 1. Users Table
-- Roles help you manage permissions in your Express middleware.
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Customer Segments
-- created_by links to a specific user.
CREATE TABLE customer_segments (
    segment_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    criteria JSONB, -- Storing complex filter criteria as JSON is best for React
    created_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL
);

-- 3. Campaigns
-- owner_id links to the user who created the campaign.
CREATE TABLE campaigns (
    campaign_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    channel VARCHAR(50),
    start_date DATE,
    end_date DATE,
    owner_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. Analytics Reports
-- Links a campaign and a segment together.
CREATE TABLE analytics_reports (
    report_id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    segment_id INTEGER REFERENCES customer_segments(segment_id) ON DELETE CASCADE,
    metrics_data JSONB NOT NULL, -- Perfect for flexible reporting data
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI Conversations
-- Logs interactions between a specific user and your AI features.
CREATE TABLE ai_conversations (
    conversation_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);