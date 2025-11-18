import { fetchMD, fetchMDAuth, overrideApiOrigin, overrideAuthOrigin, useDebugServer } from '../src/util/Network';

function createFetchMock() {
    return jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({
            'content-type': 'application/json',
        }),
        json: async () => ({ test: 'data' }),
    });
}

function assertValidUrl(url: string | URL, origin: string) {
    if (url instanceof URL) {
        expect(url.origin).toBe(origin);
    } else if (typeof url === 'string') {
        expect(url).toContain(origin);
    } else {
        fail('fetch was not called with a URL object or string');
    }
}

test('Override Auth Origin', async () => {
    const mockFetch = createFetchMock();
    global.fetch = mockFetch;

    const testOrigin = 'http://localhost';
    overrideAuthOrigin(testOrigin);

    await fetchMDAuth('/test-endpoint', { param: 'value' });

    expect(mockFetch).toHaveBeenCalled();
    const fetchCall = mockFetch.mock.calls[0];
    const urlArg = fetchCall[0];
    assertValidUrl(urlArg, testOrigin);
});

test('Override Api Origin', async () => {
    const mockFetch = createFetchMock();
    global.fetch = mockFetch;

    const testOrigin = 'http://localhost';
    overrideApiOrigin(testOrigin);

    await fetchMD('/test-endpoint', { param: 'value' });

    expect(mockFetch).toHaveBeenCalled();
    const fetchCall = mockFetch.mock.calls[0];
    const urlArg = fetchCall[0];
    assertValidUrl(urlArg, testOrigin);
});

test('Enable Debug Server', async () => {
    const mockFetch = createFetchMock();
    global.fetch = mockFetch;

    const debugAuthOrigin = 'https://auth.mangadex.dev';
    const debugApiOrigin = 'https://api.mangadex.dev';
    useDebugServer(true);

    await fetchMDAuth('/test-endpoint', { param: 'value' });
    await fetchMD('/test-endpoint', { param: 'value' });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    const authFetchCall = mockFetch.mock.calls[0];
    const authUrl = authFetchCall[0];
    assertValidUrl(authUrl, debugAuthOrigin);

    const apiFetchCall = mockFetch.mock.calls[1];
    const apiUrl = apiFetchCall[0];
    assertValidUrl(apiUrl, debugApiOrigin);
});
