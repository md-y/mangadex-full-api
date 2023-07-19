import { setOAuthImport } from './util/OAuthImporter';
import * as oauth from 'oauth4webapi';
setOAuthImport(oauth);

export * from './base';
