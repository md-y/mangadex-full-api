/* eslint-disable @typescript-eslint/no-var-requires */
const OAuthImporter: typeof import('./util/OAuthImporter') = require('./util/OAuthImporter.js');
OAuthImporter.setOAuthImport(import('oauth4webapi'));

const base = require('./base.js');
module.exports = base;
