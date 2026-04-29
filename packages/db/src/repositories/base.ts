import type { Database } from '../client';

export abstract class Repository {
  constructor(protected readonly db: Database) {}
}
