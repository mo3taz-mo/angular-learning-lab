import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { buildContent, buildDocument, parseFileName, parseFrontMatter } from './build.mjs';
import { ContentIssue, createMarkdown, renderSections } from './markdown.mjs';

const md = createMarkdown();

const META = `---
title: Sample phase
summary: A short summary.
order: 1
status: planned
---
`;

const doc = (body, meta = META) => buildDocument(md, 'sample.en.md', meta + body);

describe('file names', () => {
  it('reads the id and language', () => {
    assert.deepEqual(parseFileName('phase-00-environment.ar.md'), {
      id: 'phase-00-environment',
      lang: 'ar',
    });
  });

  it('rejects a missing language, uppercase ids and unknown languages', () => {
    for (const name of ['phase-00.md', 'Phase-00.en.md', 'phase_00.en.md', 'phase-00.fr.md']) {
      assert.throws(() => parseFileName(name), ContentIssue, name);
    }
  });
});

describe('front matter', () => {
  it('parses fields, including CRLF line endings and a BOM', () => {
    const source = '﻿---\r\ntitle: "A: title"\r\norder: 3\r\n---\r\nBody\r\n';
    const { data, body } = parseFrontMatter(source);
    assert.deepEqual(data, { title: 'A: title', order: 3 });
    assert.equal(body, 'Body\n');
  });

  it('requires the block, valid YAML and key: value lines', () => {
    assert.throws(() => parseFrontMatter('# No front matter'), /must start with a front matter/);
    assert.throws(() => parseFrontMatter('---\ntitle: [unclosed\n---\n'), /not valid YAML/);
    assert.throws(() => parseFrontMatter('---\n- a\n- b\n---\n'), /key: value/);
  });

  it('reports every problem in the fields at once', () => {
    const bad = `---
title: ""
order: "01"
status: finished
extra: 1
---
`;
    assert.throws(
      () => doc('', bad),
      (error) =>
        error instanceof ContentIssue &&
        /Unknown front matter field "extra"/.test(error.message) &&
        /"title" is required/.test(error.message) &&
        /"summary" is required/.test(error.message) &&
        /"order" is required and must be a whole number/.test(error.message) &&
        /"status" must be one of/.test(error.message),
    );
  });
});

describe('sections', () => {
  const body = `
# Ignored title

Intro paragraph.

## Learn

Learn text.

### Concept

## Lesson

Lesson text.

## Learn

Second learn piece.
`;

  it('splits intro, learn and lesson, joining repeated markers in order', () => {
    const result = doc(body);
    assert.match(result.intro, /Intro paragraph\./);
    assert.match(result.learn, /Learn text\.[\s\S]*Second learn piece\./);
    assert.doesNotMatch(result.learn, /Lesson text/);
    assert.match(result.lesson, /Lesson text\./);
  });

  it('drops the leading H1 and the marker headings from the output', () => {
    const result = doc(body);
    for (const html of [result.intro, result.learn, result.lesson]) {
      assert.doesNotMatch(html, /Ignored title|<h1/);
    }
    assert.doesNotMatch(result.learn, /<h2[^>]*>Learn<\/h2>/);
    assert.doesNotMatch(result.lesson, /<h2[^>]*>Lesson<\/h2>/);
  });

  it('keeps other H2 headings inside the current section and lists them in the table of contents', () => {
    const result = doc('## Learn\n\n## 2. Rules\n\n### Detail\n');
    assert.match(result.learn, /<h2 id="2-rules">2\. Rules<\/h2>/);
    assert.deepEqual(result.toc.learn, [
      { level: 2, id: '2-rules', text: '2. Rules' },
      { level: 3, id: 'detail', text: 'Detail' },
    ]);
  });

  it('returns null for sections that are missing or empty', () => {
    const result = doc('## Learn\n\nOnly learn.\n\n## Lesson\n');
    assert.equal(result.intro, null);
    assert.ok(result.learn);
    assert.equal(result.lesson, null);
  });

  it('matches the markers case-insensitively but exactly', () => {
    const result = doc('## LEARN\n\nA\n\n## Learn more\n\nB\n');
    assert.match(result.learn, /<h2 id="learn-more">Learn more<\/h2>/);
  });

  it('rejects a second top-level heading', () => {
    assert.throws(() => doc('# Title\n\n## Learn\n\n# Another\n'), /second top-level heading/);
  });

  it('gives duplicate headings unique ids and keeps Arabic text in ids', () => {
    const result = doc('## Learn\n\n### Step\n\n### Step\n\n### الخطوة الأولى\n');
    assert.match(result.learn, /id="step"/);
    assert.match(result.learn, /id="step-2"/);
    assert.match(result.learn, /id="الخطوة-الأولى"/);
  });
});

describe('rendering', () => {
  const render = (markdown) => renderSections(md, markdown).intro;

  it('shows raw HTML as text instead of running it', () => {
    const html = render('<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n');
    assert.doesNotMatch(html, /<script/);
    assert.doesNotMatch(html, /<img/);
    assert.match(html, /&lt;script&gt;/);
  });

  it('does not turn javascript:, vbscript: or data: links into links', () => {
    const html = render(
      '[a](javascript:alert(1)) [b](vbscript:x) [c](data:text/html;base64,AAAA) [d](JaVaScRiPt:alert(1))',
    );
    assert.doesNotMatch(html, /<a /);
  });

  it('keeps normal links and escapes link text', () => {
    const html = render('[Angular](https://angular.dev/) and [<b>x</b>](https://a.example/)');
    assert.match(html, /<a href="https:\/\/angular\.dev\/">Angular<\/a>/);
    assert.doesNotMatch(html, /<b>/);
  });

  it('renders code blocks left-to-right, escaped, with a language class', () => {
    const html = render('```powershell\nGet-ChildItem <path> & "x"\n```\n');
    assert.match(html, /<pre class="code-block" dir="ltr"><code class="language-powershell">/);
    assert.match(html, /&lt;path&gt; &amp; &quot;x&quot;/);
  });

  it('does not let an odd code fence info string inject attributes', () => {
    const html = render('```"><script>x</script>\ncode\n```\n');
    assert.doesNotMatch(html, /<script/);
    assert.doesNotMatch(html, /class="language-"/);
  });

  it('wraps tables in a scrollable, focusable container', () => {
    const html = render('| A | B |\n|---|---|\n| 1 | 2 |\n');
    assert.match(html, /<div class="table-wrap" tabindex="0"><table>/);
    assert.match(html, /<\/table><\/div>/);
  });

  it('renders task lists as disabled checkboxes', () => {
    const html = render('- [ ] open\n- [x] done\n- plain\n');
    assert.match(html, /<ul class="task-list">/);
    assert.match(
      html,
      /<li class="task-list-item"><input class="task-checkbox" type="checkbox" disabled> open/,
    );
    assert.match(html, /<input class="task-checkbox" type="checkbox" disabled checked> done/);
    assert.match(html, /<li>plain<\/li>/);
  });

  it('keeps inline code and Arabic text intact', () => {
    const html = render('اكتب `where.exe node` في الطرفية.');
    assert.match(html, /<code>where\.exe node<\/code>/);
    assert.match(html, /اكتب/);
  });
});

describe('buildContent', () => {
  const workspace = () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'content-test-'));
    const inputDir = path.join(root, 'in');
    const outputDir = path.join(root, 'out');
    fs.mkdirSync(inputDir);
    return { root, inputDir, outputDir };
  };
  const write = (dir, name, content) => fs.writeFileSync(path.join(dir, name), content);
  const meta = (order, status = 'planned', title = 'T') =>
    `---\ntitle: ${title}\nsummary: S\norder: ${order}\nstatus: ${status}\n---\n`;

  it('writes an ordered index and one JSON file per document', () => {
    const { inputDir, outputDir } = workspace();
    write(inputDir, 'b-two.en.md', `${meta(2)}## Lesson\n\nB\n`);
    write(inputDir, 'a-one.en.md', `${meta(1, 'done', 'One')}## Learn\n\nA\n`);
    write(inputDir, 'a-one.ar.md', `${meta(1, 'done', 'واحد')}## Learn\n\nأ\n`);
    write(inputDir, 'README.md', 'notes, ignored');
    write(inputDir, '_draft.en.md', 'not valid, ignored');

    buildContent({ inputDir, outputDir });

    const index = JSON.parse(fs.readFileSync(path.join(outputDir, 'index.json'), 'utf8'));
    assert.deepEqual(
      index.phases.map((phase) => phase.id),
      ['a-one', 'b-two'],
    );
    assert.deepEqual(index.phases[0].languages, ['en', 'ar']);
    assert.deepEqual(index.phases[0].title, { en: 'One', ar: 'واحد' });
    assert.deepEqual(fs.readdirSync(outputDir).sort(), [
      'a-one.ar.json',
      'a-one.en.json',
      'b-two.en.json',
      'index.json',
    ]);
    const arabic = JSON.parse(fs.readFileSync(path.join(outputDir, 'a-one.ar.json'), 'utf8'));
    assert.equal(arabic.lang, 'ar');
    assert.match(arabic.learn, /أ/);
  });

  it('removes output for files that were deleted', () => {
    const { inputDir, outputDir } = workspace();
    write(inputDir, 'a.en.md', `${meta(1)}x\n`);
    write(inputDir, 'b.en.md', `${meta(2)}y\n`);
    buildContent({ inputDir, outputDir });
    fs.rmSync(path.join(inputDir, 'b.en.md'));
    buildContent({ inputDir, outputDir });
    assert.deepEqual(fs.readdirSync(outputDir).sort(), ['a.en.json', 'index.json']);
  });

  it('reports every problem across files and publishes nothing', () => {
    const { inputDir, outputDir } = workspace();
    write(inputDir, 'ok.en.md', `${meta(1)}fine\n`);
    write(inputDir, 'bad-name.md', `${meta(2)}x\n`);
    write(inputDir, 'no-meta.en.md', '# nothing\n');
    write(inputDir, 'same-order.en.md', `${meta(1)}x\n`);
    fs.mkdirSync(path.join(inputDir, 'images'));

    assert.throws(
      () => buildContent({ inputDir, outputDir }),
      (error) =>
        error instanceof ContentIssue &&
        /bad-name\.md: File name must look like/.test(error.message) &&
        /no-meta\.en\.md: The file must start with a front matter/.test(error.message) &&
        /order 1 is already used by "ok"/.test(error.message) &&
        /images\/: subfolders are not supported/.test(error.message),
    );
    assert.equal(fs.existsSync(outputDir), false);
  });

  it('requires the same order and status in every language of a phase', () => {
    const { inputDir, outputDir } = workspace();
    write(inputDir, 'a.en.md', `${meta(1, 'done')}x\n`);
    write(inputDir, 'a.ar.md', `${meta(2, 'planned')}x\n`);
    assert.throws(
      () => buildContent({ inputDir, outputDir }),
      /a: the en and ar files disagree on order\/status/,
    );
  });

  it('fails clearly when the content folder is missing', () => {
    const { root, outputDir } = workspace();
    assert.throws(
      () => buildContent({ inputDir: path.join(root, 'missing'), outputDir }),
      /content folder does not exist/,
    );
  });
});

describe('the real content folder', () => {
  it('builds without problems', () => {
    const root = path.resolve(import.meta.dirname, '..', '..');
    const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-real-'));
    const { documents } = buildContent({ inputDir: path.join(root, 'docs', 'content'), outputDir });
    assert.ok(documents.length >= 1);
  });
});
