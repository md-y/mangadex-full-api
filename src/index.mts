import { setOAuthImport } from './util/OAuthImporter.js';
import * as oauth from 'oauth4webapi';
setOAuthImport(oauth);

export * from './base.js';
