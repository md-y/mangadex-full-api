/* eslint-disable no-console */
import { generateApi } from 'swagger-typescript-api';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const MANGADEX_SPEC_URL = 'https://api.mangadex.org/docs/static/api.yaml';
const TARGET_DIR = 'src/types/';
const TARGET_NAME = 'schema.ts';

const BUGGED_DATELESS_PROPS = ['updatedAt', 'readableAt', 'createdAt', 'publishAt'];

export async function buildSchema(silent = false) {
    if (!silent) console.log('Starting schema build...');

    let targetPath = path.resolve(process.cwd());
    if (path.basename(targetPath) === 'scripts') {
        targetPath = path.join(targetPath, '..');
    }
    targetPath = path.join(targetPath, TARGET_DIR);

    await generateApi({
        fileName: TARGET_NAME,
        output: targetPath,
        url: MANGADEX_SPEC_URL,
        generateClient: false,
        generateRouteTypes: true,
        extractRequestParams: true,
        typeSuffix: 'Schema',
        silent: silent,
        hooks: {
            onCreateComponent: (component) => {
                if (component.rawTypeData !== undefined) {
                    // Make properties required by default
                    if (component.rawTypeData.required === undefined) {
                        component.rawTypeData.required = true;
                    }
                    if (component.rawTypeData.properties !== undefined) {
                        let props = component.rawTypeData.properties;
                        for (const key in props) {
                            // Fix bugged fields that should be date-time, but aren't
                            if (
                                BUGGED_DATELESS_PROPS.includes(key) &&
                                props[key].type === 'string' &&
                                !('format' in props[key]) &&
                                !('enum' in props[key])
                            ) {
                                props[key].format = 'date-time';
                            }

                            // Fix enum fields that should be boolean, but aren't
                            if (
                                props[key].type === 'string' &&
                                'enum' in props[key] &&
                                props[key].enum.includes('true') &&
                                props[key].enum.includes('false')
                            ) {
                                props[key].type = 'boolean';
                                delete props[key].enum;
                            }
                        }
                    }
                }
                return component;
            },
        },
        codeGenConstructs: () => ({
            ArrayType: (content) => {
                // There are arrays without types that should be strings,
                // so this fixes that bug:
                if (content === 'any') content = 'string';
                return `(${content})[]`;
            },
            TypeField: ({ readonly, key, optional, value }) => {
                // Remove brackets from query array parameters
                if (key.startsWith('"') && key.endsWith('[]"')) key = key.slice(1, -3);
                return [readonly && 'readonly ', key, optional && '?', ': ', value].filter((i) => i !== false).join('');
            },
        }),
        primitiveTypeConstructs: () => ({
            string: {
                'date-time': 'Date',
            },
        }),
    });

    if (!silent) console.log('Wrote schema to file:', targetPath);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    buildSchema();
}
