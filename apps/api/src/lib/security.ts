import { AppError } from './errors';

const blockedHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

export function assertPublicHttpUrl(value: string) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new AppError('invalid_url', 'Only http and https URLs are supported', 422);
  }
  if (blockedHosts.has(url.hostname) || url.hostname.endsWith('.local')) {
    throw new AppError('unsafe_url', 'Private or local URLs are not allowed', 422);
  }
  return url.toString();
}
