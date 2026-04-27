CarePulse Dataset

Files:
- users.csv (500 rows)
- customer_segments.csv (200 rows)
- campaigns.csv (5000 rows)
- analytics_reports.csv (100000 rows)
- ai_conversations.csv (50000 rows)

Suggested relationships:
- campaigns.owner_id -> users.user_id
- customer_segments.created_by -> users.user_id
- analytics_reports.campaign_id -> campaigns.campaign_id
- analytics_reports.segment_id -> customer_segments.segment_id
- ai_conversations.user_id -> users.user_id

Use cases:
- Demo dashboards
- CRUD testing
- API pagination/filtering
- Role-based access demos
- AI analytics summaries

