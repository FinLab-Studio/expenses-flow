import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchJson } from './fetch-json';

describe('fetchJson', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads JSON from a path inside the app base URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json([{ id: '1' }]));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchJson('data/items.json')).resolves.toEqual([{ id: '1' }]);
    expect(fetchMock).toHaveBeenCalledWith('/data/items.json');
  });

  it('rejects when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })));

    await expect(fetchJson('data/items.json')).rejects.toThrow(
      'Failed to load data/items.json: 404',
    );
  });
});
