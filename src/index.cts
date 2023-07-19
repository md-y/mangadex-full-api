/* eslint-disable @typescript-eslint/no-var-requires */
const OAuthImporter: typeof import('./util/OAuthImporter') = require('./util/OAuthImporter');
OAuthImporter.setOAuthImport(import('oauth4webapi'));

const base = require('./base');
module.exports = base;
