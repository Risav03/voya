import { env } from '../config/env';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly details?: unknown) {
    super(message);
  }
}

export class ApiClient {
  private sessionCookie: string | null = null;
  constructor(private readonly baseUrl = env.apiUrl) {}

  setSessionCookie(cookie: string | null) { this.sessionCookie = cookie; }

  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
        ...(this.sessionCookie ? { cookie: this.sessionCookie } : {}),
        ...(init?.headers ?? {}),
      },
    });

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) this.sessionCookie = setCookie;

    const text = await response.text();
    const payload = text ? JSON.parse(text) as unknown : null;

    if (!response.ok) {
      const message = typeof payload === 'object' && payload && 'error' in payload
        ? String((payload as { error?: { message?: unknown } }).error?.message ?? 'API request failed')
        : `API request failed: ${response.status}`;
      throw new ApiError(response.status, message, payload);
    }

    return payload as T;
  }

  get<T>(path: string) { return this.request<T>(path); }
  post<T>(path: string, body?: unknown) { return this.request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }); }
  patch<T>(path: string, body?: unknown) { return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }); }
  delete<T>(path: string) { return this.request<T>(path, { method: 'DELETE' }); }
}

export const apiClient = new ApiClient();
