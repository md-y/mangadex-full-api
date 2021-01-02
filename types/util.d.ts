export function getHTTPS(url: string | URL): Promise<any>;
export function getJSON(url: string | URL): Promise<any>;
export function getMatches(url: string | URL, regex: RegExp): Promise<any>;
export function quickSearch(query: string, regex: RegExp): Promise<any>;
export function generateMultipartBoundary(): string;
export function generateMultipartPayload(boundary?: string, obj?: any): any;
export function getKeyByValue(obj: any, value: string): string;
export function parseEnumArray(en: any, arr: any[]): any[];
