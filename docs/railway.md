# Railway Deployment

Create two Railway services from this repository:

1. API service using `railway.api.json`
2. Worker service using `railway.worker.json`

Attach managed Postgres with PostGIS enabled and a Redis service. Run migrations manually from a trusted environment:

```sh
bun db:migrate
```

## Required API env

- `NODE_ENV=production`
- `API_PORT` or Railway `PORT`
- `API_PUBLIC_URL`
- `DATABASE_URL`
- `REDIS_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` if Google auth is enabled

## Required worker env

- `NODE_ENV=production`
- `DATABASE_URL`
- `REDIS_URL`
- `ANTHROPIC_API_KEY` for Claude-backed extraction and itinerary generation
- `OPENAI_API_KEY` for Whisper/transcription if used
- `VISION_API_KEY` if using a separate vision provider
- `GOOGLE_MAPS_API_KEY` for place resolution
- S3 credentials: `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

## Production notes

- Do not auto-run destructive migrations on boot.
- Keep API and worker as separate Railway services so queue throughput can scale independently.
- Use Railway private networking for Postgres and Redis where available.
- Set `BETTER_AUTH_URL` to the public API URL.
- Set `MOBILE_PUBLIC_API_URL` in EAS/Expo config to the public API URL.
