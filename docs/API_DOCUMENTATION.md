# CarePulse API Documentation

## Authentication
All protected routes require:
```http
Authorization: Bearer <token>
```

## Auth routes
### POST `/api/register`
Creates a new user.

Body:
```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "password123",
  "role": "analyst"
}
```

### POST `/api/login`
Returns a bearer token and the authenticated user.

### GET `/api/me`
Returns the currently authenticated user.

## Users
### GET `/api/users`
Admin only. Returns all users.

### GET `/api/users/:id`
Returns one user. Analysts may only view themselves.

## Campaigns
### GET `/api/campaigns`
Returns campaigns. Analysts only see their own campaigns.

### GET `/api/campaigns/:id`
Returns one campaign.

### POST `/api/campaigns`
Creates a campaign for the authenticated user.

### PUT `/api/campaigns/:id`
Updates a campaign.

### DELETE `/api/campaigns/:id`
Admin only.

## Customer Segments
### GET `/api/segments`
Returns all segments.

### GET `/api/segments/:id`
Returns one segment.

### POST `/api/segments`
Creates a segment.

### PUT `/api/segments/:id`
Admin only.

### DELETE `/api/segments/:id`
Admin only.

## Analytics Reports
### GET `/api/reports`
Returns all reports.

### GET `/api/reports/campaign/:campaign_id`
Returns reports for one campaign.

### POST `/api/reports/generate`
Admin only. Generates a report.

Body:
```json
{
  "campaign_id": 1,
  "segment_id": 1,
  "metrics_data": {
    "impressions": 25000,
    "clicks": 2800,
    "conversions": 310,
    "revenue": 14000
  }
}
```

## AI routes
### GET `/api/ai/history/:user_id`
Returns saved AI conversation history for a user.

### POST `/api/ai/chat`
Sends a prompt to the FastAPI AI service and stores the response.

Body:
```json
{
  "prompt": "Which customer segment should receive more budget next month?",
  "use_live_llm": false
}
```
