import { cp, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(projectRoot, 'public');

await mkdir(publicRoot, { recursive: true });

for (const directory of ['assets', 'css', 'js']) {
  await cp(
    path.join(projectRoot, directory),
    path.join(publicRoot, directory),
    {
      recursive: true,
      force: true,
      filter: (source) => !source.endsWith('.example.js')
    }
  );
}

for (const file of ['robots.txt', 'sitemap.xml']) {
  await cp(path.join(projectRoot, file), path.join(publicRoot, file));
}

const verificationFiles = (await readdir(projectRoot)).filter((file) =>
  /^google[a-z0-9_-]*\.html$/i.test(file)
);

for (const file of verificationFiles) {
  await cp(path.join(projectRoot, file), path.join(publicRoot, file));
}
