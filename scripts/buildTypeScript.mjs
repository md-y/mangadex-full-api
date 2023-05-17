import Shell from 'shelljs';

// Remove old build
Shell.rm('-r', './dist');

// Build ESM
Shell.exec('npx tsc');
Shell.cd('./dist/esm/');
Shell.mv('index.mjs', 'index.js');
Shell.echo('{"type":"module"}').to('package.json');
Shell.cd('../..');

// Build CJS
Shell.exec('npx tsc -p tsconfig.cjs.json');
Shell.cd('./dist/cjs/');
Shell.mv('index.cjs', 'index.js');
Shell.echo('{"type":"commonjs"}').to('package.json');
Shell.cd('../..');

// Build Types
Shell.exec('npx tsc -p tsconfig.types.json');
