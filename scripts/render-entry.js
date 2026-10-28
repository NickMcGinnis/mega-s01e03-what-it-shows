import { render } from 'svelte/server';
import { mkdir, writeFile, readdir, readFile } from 'node:fs/promises';

const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });
const cssFiles = (await readdir('.render-bundle/assets')).filter(f => f.endsWith('.css'));
const css = (await Promise.all(cssFiles.map(f => readFile(`.render-bundle/assets/${f}`, 'utf8')))).join('\n');
for (const [path, mod] of Object.entries(pages)) {
  const { body, head } = render(mod.default);
  const route = path.replace('/src/routes/', '').replace('/+page.svx', '');
  const dir = `rendered/${route}`;
  await mkdir(dir, { recursive: true });
  const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${head}<style>${css}</style></head><body>${body}</body></html>\n`;
  await writeFile(`${dir}/index.html`, html);
  console.log(`Rendered ${route}`);
}
