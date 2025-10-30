import { build } from 'tsup';

(async function () {
    const sharedOptions = {
        bundle: true,
        minify: true,
        outDir: './dist',
        sourcemap: true,
    };

    await build({
        ...sharedOptions,
        entry: ['./src/index.ts'],
        format: 'esm',
        outExtension: () => ({ js: '.mjs' }),
        dts: false,
        clean: true,
    });

    await build({
        ...sharedOptions,
        entry: ['./src/index.ts'],
        format: 'cjs',
        dts: true,
    });
})();
