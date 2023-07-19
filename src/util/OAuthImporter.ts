/*
oauth4webapi is great, but it is an ES module. Because MFA wants to natively support
CommonJs without require an async import, this file is required.

If MFA is being used as a ES module, it will statically import oauth4webapi.
If MFA is being used as a CommonJS module, it will request the module asynchronously. This
is fine because any references to oauth4webapi are already asynchronous.
*/

type OAuthImportType = typeof import('oauth4webapi');

let cachedOauthImport: OAuthImportType | Promise<OAuthImportType>;

export function setOAuthImport(oauth: OAuthImportType | Promise<OAuthImportType>) {
    cachedOauthImport = oauth;
}

export async function getOAuthImport(): Promise<OAuthImportType> {
    if (!cachedOauthImport) {
        throw new Error(
            'The Oauth module has not been imported. Make sure you access the module from index.mjs or index.js',
        );
    }
    return cachedOauthImport;
}
