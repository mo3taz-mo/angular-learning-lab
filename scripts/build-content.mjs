// Usage:
//   node scripts/build-content.mjs           build once (used by pnpm start / build / test)
//   node scripts/build-content.mjs --watch   rebuild whenever a file in docs/content changes
import fs from 'node:fs';
import path from 'node:path';
import { buildContent } from './content/build.mjs';
import { ContentIssue } from './content/markdown.mjs';

const root = path.resolve(import.meta.dirname, '..');
const inputDir = path.join(root, 'docs', 'content');
const outputDir = path.join(root, 'public', 'content');
const watch = process.argv.includes('--watch');

function run() {
  try {
    const { documents, phases } = buildContent({ inputDir, outputDir });
    console.log(
      `Content: ${phases.length} phase(s), ${documents.length} document(s) -> ${path.relative(root, outputDir)}`,
    );
    return true;
  } catch (error) {
    if (!(error instanceof ContentIssue)) {
      throw error;
    }
    console.error(`\nContent problems in ${path.relative(root, inputDir)}:\n`);
    console.error(error.message.replace(/^/gm, '  '));
    console.error('\nFix the file(s) above and run again. Nothing was published.\n');
    return false;
  }
}

const ok = run();

if (!watch) {
  process.exit(ok ? 0 : 1);
}

console.log(`Watching ${path.relative(root, inputDir)} (press Ctrl+C to stop)...`);
let timer;
fs.watch(inputDir, { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(run, 150);
});
