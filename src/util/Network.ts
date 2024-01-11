import IDObject from '../internal/IDObject';
import APIResponseError from './APIResponseError';
import AuthError from './AuthError';

import type { CheckResponseSchema, ErrorResponseSchema } from '../types/schema';
import type { IAuthClient } from '../types/helpers';

type ParameterObj = {
    [x: string]:
        | string
        | string[]
        | number
        | number[]
        | boolean
        | { [x: string]: string | number }
        | IDObject
        | IDObject[]
        | undefined;
};

type ListResponse = { data: { id: string }[]; limit: number; offset: number; total: number };

type CustomRequestInit = Omit<RequestInit, 'headers'> & { headers?: Record<string, string>; noAuth?: boolean };

class NetworkStateManager {
    static useDebugServerValue = false;
    static activeClient: IAuthClient | undefined;
}

/**
 * If true the debug (sandbox) MangaDex domain wil be used instead of the default one.
 * {@link https://sandbox.mangadex.dev}
 */
export function useDebugServer(val: boolean) {
    NetworkStateManager.useDebugServerValue = val;
}
/**
 * Returns if the debug (sandbox) MangaDex domain is in use
 */
export function isDebugServerInUse() {
    return NetworkStateManager.useDebugServerValue;
}

/**
 * Sets the AuthClient to be used by API calls
 * @param client - The signed-in OAuth or legacy AuthClient
 */
export function setActiveAuthClient(client: IAuthClient) {
    NetworkStateManager.activeClient = client;
}

/**
 * Removes the current active AuthClient so no further API calls are done with user authorization
 */
export function clearActiveAuthClient() {
    NetworkStateManager.activeClient = undefined;
}

/**
 * Returns the current auth client or null if there is none
 */
export function getActiveAuthClient() {
    return NetworkStateManager.activeClient ?? null;
}

/**
 * Performs a fetch request to MangaDex and parses the response as JSON.
 */
export async function fetchMD<T extends object>(
    endpoint: string,
    params?: ParameterObj,
    requestInit: CustomRequestInit = {},
): Promise<T> {
    const domain = NetworkStateManager.useDebugServerValue ? 'https://api.mangadex.dev' : 'https://api.mangadex.org/';
    const url = buildURL(domain, endpoint, params);

    if (NetworkStateManager.activeClient && !requestInit.noAuth) {
        const sessionToken = await NetworkStateManager.activeClient.getSessionToken();
        if (requestInit.headers === undefined) requestInit.headers = {};
        requestInit.headers['authorization'] = `Bearer ${sessionToken}`;
    }
    const res = await fetch(url, requestInit);

    // Raise error if response isn't JSON
    const contentType = res.headers.get('content-type');
    if (!contentType?.toLowerCase().includes('json')) {
        let errInfo = `${res.statusText} (${res.status}) Response was an unexpected content type: ${
            contentType ?? 'Unspecified Type'
        }.`;
        try {
            let text = await res.text();
            if (text.length > 128) text = text.slice(0, 128);
            errInfo += `\nStart of Body: ${text}`;
        } catch (_) {}
        throw new APIResponseError(errInfo);
    }

    // Raise error if response is a MD error
    const data = (await res.json()) as ErrorResponseSchema | T;
    if ('result' in data && data.result !== 'ok') {
        throw new APIResponseError(data);
    }

    // Raise error if error status code was given
    if (res.status >= 400) {
        throw new APIResponseError(`${res.statusText} (${res.status})`);
    }

    return data as T;
}

/**
 * Same as {@link fetchMD}, but returns the 'data' property of the response instead
 */
export async function fetchMDData<T extends { data: unknown }>(
    endpoint: string,
    params?: ParameterObj,
    requestInit?: CustomRequestInit,
): Promise<T['data']> {
    const res = await fetchMD<T>(endpoint, params, requestInit);
    return res.data;
}

/**
 * Same as {@link fetchMDData} but is designed specifically for search requests. This means that
 * multiple requests will be used for extreme limits.
 */
export async function fetchMDSearch<T extends ListResponse>(
    endpoint: string,
    params: ParameterObj & { limit?: number; offset?: number } = {},
    requestInit?: CustomRequestInit,
    maxLimit = 100,
    defaultLimit = 10,
): Promise<T['data']> {
    // Setup initial limit and offset values:
    const MAX_POSSIBLE_RESULTS = 10000; // Hard limit for any endpoint is 10000 total results
    let targetLimit = Math.min(params.limit ?? defaultLimit, MAX_POSSIBLE_RESULTS);
    const initialOffset = params.offset ?? 0;
    if (initialOffset >= MAX_POSSIBLE_RESULTS || targetLimit <= 0) return [];
    if (initialOffset > MAX_POSSIBLE_RESULTS - Math.min(maxLimit, targetLimit)) {
        // Make limit smaller to avoid bounds error if offset is close to MAX_POSSIBLE_RESULTS
        targetLimit = MAX_POSSIBLE_RESULTS - initialOffset;
    }

    // Get one result to find out how many total results there are
    const firstResponse = await fetchMD<T>(
        endpoint,
        { ...params, limit: Math.min(targetLimit, maxLimit) },
        requestInit,
    );
    // Return immediately if multiple requests aren't needed, or if the result contains all possible results
    if (targetLimit <= maxLimit || firstResponse.total <= firstResponse.data.length + initialOffset) {
        return firstResponse.data;
    }
    // Lower the limit if there aren't that many results
    targetLimit = Math.min(targetLimit, firstResponse.total);

    // Create an array of requests with each request having the maximum limit until the target limit is reached
    const promises: Promise<T['data']>[] = [];
    for (let offset = initialOffset + maxLimit; offset < targetLimit; offset += maxLimit) {
        const limitForThisRequest = Math.min(targetLimit - offset, maxLimit);
        promises.push(fetchMDData<T>(endpoint, { ...params, limit: limitForThisRequest, offset: offset }, requestInit));
    }
    const newResults = await Promise.all(promises);
    return firstResponse.data.concat(...newResults);
}

/**
 * Will request a list of objects by an array of their ids (or similar) as a query parameter. This
 * function also accepts extra parameters in the same format as {@link fetchMDSearch}.
 */
export async function fetchMDByArrayParam<T extends ListResponse>(
    endpoint: string,
    arr: (string | IDObject)[],
    extraParams: ParameterObj = {},
    arrayParam = 'ids',
    paramLimit = 100,
    requestInit?: CustomRequestInit,
): Promise<T['data']> {
    const idArray = arr.map((elem) => (elem instanceof IDObject ? elem.id : elem));
    const promises = [];
    for (let i = 0; i < idArray.length; i += paramLimit) {
        promises.push(
            fetchMDData<T>(
                endpoint,
                { ...extraParams, [arrayParam]: idArray.slice(i, i + paramLimit), limit: paramLimit },
                requestInit,
            ),
        );
    }
    const results = await Promise.all(promises);
    // Reorder results so that they're in the same order as the id array
    const sortedResults = results.flat();
    sortedResults.sort((a, b) => idArray.indexOf(a.id) - idArray.indexOf(b.id));
    return sortedResults;
}

/**
 * Same as {@link fetchMD}, but it instead performs a request with a JSON body
 */
export async function fetchMDWithBody<T extends object>(
    endpoint: string,
    body: object,
    params?: ParameterObj,
    method = 'POST',
    requestInit: CustomRequestInit = {},
): Promise<T> {
    const headers = requestInit.headers !== undefined ? requestInit.headers : {};
    headers['Content-Type'] = 'application/json';
    return fetchMD<T>(endpoint, params, {
        body: JSON.stringify(body),
        method: method,
        headers: headers,
    });
}

/**
 * Same as {@link fetchMDData}, but it instead performs a request with a JSON body
 */
export async function fetchMDDataWithBody<T extends { data: unknown }>(
    endpoint: string,
    body: object,
    params?: ParameterObj,
    method = 'POST',
    requestInit: CustomRequestInit = {},
): Promise<T['data']> {
    const res = await fetchMDWithBody<T>(endpoint, body, params, method, requestInit);
    return res['data'];
}

/**
 * Performs a POST fetch request to api.mangadex.network with a JSON body
 */
export async function postToMDNetwork<T extends object>(
    endpoint: string,
    body: object,
    params?: ParameterObj,
): Promise<T> {
    const url = buildURL('https://api.mangadex.network', endpoint, params);
    const res = await fetch(url, {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await res.json();
    return json as T;
}

export async function fetchMDWithFormData<T extends object>(
    endpoint: string,
    body: Record<
        string,
        | string
        | string[]
        | Blob
        | Blob[]
        | { data: string | Blob; name: string }
        | { data: string | Blob; name: string }[]
        | undefined
        | null
    >,
    params?: ParameterObj,
    method = 'POST',
    requestInit: CustomRequestInit = {},
): Promise<T> {
    const formdata = new FormData();
    const appendItem = (name: string, item: Blob | string | { data: string | Blob; name: string }) => {
        if (typeof item !== 'string' && 'data' in item && 'name' in item) {
            formdata.append(name, item.data as Blob, item.name);
        } else {
            formdata.append(name, item);
        }
    };
    for (const [name, value] of Object.entries(body)) {
        if (value) {
            // MD accepts array values as name + index, not name[]
            if (Array.isArray(value)) value.forEach((v, i) => appendItem(name + i, v));
            else appendItem(name, value);
        }
    }
    return await fetchMD<T>(endpoint, params, {
        ...requestInit,
        method: method,
        body: formdata,
    });
}

/**
 * Generate a url from a base domain, path, and parameter object
 */
export function buildURL(base: string, path?: string, params?: ParameterObj): URL {
    const url = path ? new URL(path, base) : new URL(base);
    if (!params) return url;

    for (const [name, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
            for (let i of value) {
                if (i instanceof IDObject) i = i.id;
                url.searchParams.append(`${name}[]`, i.toString());
            }
        } else if (typeof value === 'object') {
            if (value instanceof IDObject) {
                url.searchParams.append(name, value.id.toString());
            } else {
                const valueEntries = Object.entries(value);
                for (const [k, v] of valueEntries) {
                    url.searchParams.append(`${name}[${k}]`, v.toString());
                }
            }
        } else if (value !== undefined) {
            url.searchParams.append(name, value.toString());
        }
    }

    return url;
}

/**
 * Checks if the current user is correctly authorized or if the specified session token is valid.
 */
export async function performAuthCheck(sessionToken?: string): Promise<boolean> {
    try {
        let options: CustomRequestInit | undefined = undefined;
        if (sessionToken !== undefined) {
            options = {
                headers: {
                    authorization: `Bearer ${sessionToken}`,
                },
                noAuth: true,
            };
        }
        const res = await fetchMD<CheckResponseSchema>('/auth/check', undefined, options);
        return res.isAuthenticated;
    } catch (err) {
        if (err instanceof APIResponseError) return false;
        else throw err;
    }
}

/**
 * Send a URL-encoded POST request to the MangaDex auth server
 */
export async function fetchMDAuth<T extends object>(endpoint: string, body: Record<string, string>): Promise<T> {
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(body)) params.append(name, value);
    const domain = `https://auth.mangadex.${isDebugServerInUse() ? 'dev' : 'org'}`;
    const url = new URL(endpoint, domain);
    const res = await fetch(url, {
        body: params,
        method: 'POST',
    });

    if (res.status >= 400) {
        throw new AuthError(`${res.statusText} (${res.status})`);
    }

    const resBody: T = await res.json();
    return resBody;
}
