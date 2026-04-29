import { describe, expect, test } from 'bun:test';
import { AppError } from './errors';

describe('api errors', () => {
  test('carries status and code', () => {
    const error = new AppError('bad_request', 'Bad request', 400);
    expect(error.status).toBe(400);
  });
});
