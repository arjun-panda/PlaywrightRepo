import { test, expect, request } from '@playwright/test';
import { env } from '../../src/config/env';

test.describe('Posts API', () => {
  test('GET returns a post with the expected structure', async () => {
    const api = await request.newContext({ baseURL: env.apiBaseURL });

    try {
      const response = await api.get('/posts/1');
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toMatchObject({
        userId: 1,
        id: 1,
      });
      expect(typeof body.title).toBe('string');
      expect(typeof body.body).toBe('string');
    } finally {
      await api.dispose();
    }
  });

  test('POST creates a post and returns submitted data', async () => {
    const api = await request.newContext({ baseURL: env.apiBaseURL });

    try {
      const payload = {
        title: 'Playwright API test',
        body: 'Created by the automation framework',
        userId: 1,
      };

      const response = await api.post('/posts', { data: payload });
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body).toMatchObject(payload);
      expect(body.id).toBeTruthy();
    } finally {
      await api.dispose();
    }
  });
});
