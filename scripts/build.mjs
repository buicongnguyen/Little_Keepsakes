import {cp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build, transform} from 'esbuild';

// A static site in dist/: one minified bundle (three.js included), the page and its CSS. Works in any subfolder.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), out = path.join(root, 'dist');
await rm(out, {recursive: true, force: true}); await mkdir(out, {recursive: true});
const result = await build({absWorkingDir: root, entryPoints: ['src/main.js'], outdir: path.join(out, 'js'), bundle: true, format: 'esm',
  minify: true, target: 'es2022', entryNames: '[name]-[hash]', legalComments: 'eof', metafile: true});
const bundle = Object.keys(result.metafile.outputs).find(f => f.endsWith('.js'));
const html = (await readFile(path.join(root, 'index.html'), 'utf8'))
  .replace(/<script type="importmap">[\s\S]*?<\/script>/, '')
  .replace('./src/main.js', './' + path.relative(out, path.resolve(root, bundle)).split(path.sep).join('/'));
await writeFile(path.join(out, 'index.html'), html);
await writeFile(path.join(out, 'style.css'), (await transform(await readFile(path.join(root, 'style.css'), 'utf8'), {loader: 'css', minify: true})).code);
await mkdir(path.join(out, 'licenses')); await cp(path.join(root, 'node_modules/three/LICENSE'), path.join(out, 'licenses/three.txt'));
await writeFile(path.join(out, '.nojekyll'), '');
await writeFile(path.join(out, 'build-info.json'), JSON.stringify({name: 'Little Keepsakes', version: JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')).version, commit: process.env.GITHUB_SHA || null}, null, 2) + '\n');
console.log('Built dist/');

// Home-screen metadata accompanies the existing bundled game.
const { copyFile: mobileHomeScreenCopy } = await import('node:fs/promises');
await mobileHomeScreenCopy(new URL('../manifest.webmanifest', import.meta.url), new URL('../dist/manifest.webmanifest', import.meta.url));
