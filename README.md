# Reels To Real Travel

Production-grade travel intelligence platform scaffolded as a Bun/Turborepo monorepo.

## Commands

```sh
bun install
bun run dev
bun run typecheck
bun run lint
bun run db:generate
bun run db:migrate
```

## Workspaces

- `apps/mobile` - Expo React Native app
- `apps/api` - ElysiaJS API on Bun
- `apps/worker` - BullMQ background workers
- `packages/db` - Drizzle/PostgreSQL/PostGIS schema and DB helpers
- `packages/types` - Shared Zod schemas and TypeScript contracts
- `packages/ai` - AI provider abstractions and structured output validators
- `packages/geo` - Geo, clustering, routing, and place resolution helpers
- `packages/ui` - Shared React Native UI primitives
- `packages/config` - Shared lint, TypeScript, and formatting config
- `packages/analytics` - Typed app event helpers
