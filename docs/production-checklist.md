# Production Core Flow Checklist

Before release:

- `bun run typecheck`
- `bun run lint`
- `bun run test`
- `bun run db:generate`
- API `/health` responds on Railway
- Worker connects to Redis and processes a smoke ingestion job
- `POST /ingest/reel` creates `saved_items` and `ingestion_jobs`
- Ingestion worker resolves or creates a `places` record
- Mobile can create a trip and queue itinerary generation
- Live check-in creates `checkins` and `travel_graph_edges`
- Better Auth session persists across app restarts
- Railway envs are set separately for API and worker
