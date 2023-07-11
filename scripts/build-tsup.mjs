import { build } from 'tsup';

(async function () {
    const sharedOptions = {
        bundle: true,
        minify: true,
        outDir: './dist',
    };

    await build({
        ...sharedOptions,
        entry: ['./src/index.mts'],
        format: 'esm',
        outExtension: () => ({ js: '.mjs' }),
        dts: true,
        clean: true,
    });

    await build({
        ...sharedOptions,
        entry: ['./src/index.cts'],
        format: 'cjs',
    });
})();
