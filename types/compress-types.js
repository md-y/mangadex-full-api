/*

Run this script only after 'tsc' and in the root directory.
Also, this script is awful. Don't think about what its doing too much.
"It just works."

*/

const Fs = require('fs');
const Path = require('path');

const PRIVATE_FOLDERS = [ 'internal' ];
const IGNORE_FILES = [ 'util.d.ts', 'auth.d.ts' ];

var typeRootDir = '.\\types';
var moduleLines = [ `declare module 'mangadex-full-api' {` ];
var footerLines = [ `}`];

function parseStructureDir(dirPath) {
    let fileNames = Fs.readdirSync(dirPath).filter(elem => elem.includes('.d.ts'));
    let isPrivate = PRIVATE_FOLDERS.includes(Path.basename(dirPath));
    for (let name of fileNames) {
        let lines, filePath = Path.join(dirPath, name), fileBuffer = Fs.readFileSync(filePath, 'utf-8');
        try { lines = fileBuffer.toString().split('\n'); } catch { continue; }
        for (let line of lines) {
            if (line.startsWith('import') || line.includes('export = ')) continue;
            if (line.includes('declare class') && !isPrivate) line = line.replace('declare class', 'export class');
            if (isPrivate) footerLines.push(line);
            else moduleLines.push(`\t${line}`);
        }
        Fs.unlinkSync(filePath);
    }
    if (Fs.readdirSync(dirPath).length === 0) Fs.rmdirSync(dirPath);
}

function parseOtherFile(filePath) {
    if (!filePath.includes('.d.ts')) return;
    if (!IGNORE_FILES.includes(Path.basename(filePath))) {
        let fileBuffer = Fs.readFileSync(filePath);
        let lines;
        try { lines = fileBuffer.toString().split('\n'); } catch { return; }
        for (let line of lines) {
            if (line.startsWith('import')) continue;
            if (line.startsWith('export {')) continue; // Remove unneeded class exports
            moduleLines.push(`\t${line}`);
        }
    }
    Fs.unlinkSync(filePath);
}

// Read and delete index.d.ts
Fs.readdirSync(typeRootDir).filter(elem => elem.includes('.d.ts')).forEach(elem => parseOtherFile(Path.join(typeRootDir, elem)));
// Read and delete structure folders
Fs.readdirSync(typeRootDir).filter(elem => !elem.includes('.')).forEach(elem => parseStructureDir(Path.join(typeRootDir, elem)));
// Write new index.d.ts
Fs.writeFileSync(Path.join(typeRootDir, 'index.d.ts'), `${moduleLines.join('\n')}\n${footerLines.join('\n')}`);