// Builds the content that the app shows from the Markdown files in docs/content.
//
// File name:  <id>.<language>.md      e.g. phase-00-environment-and-repository.en.md
// Front matter (required, between --- lines): title, summary, order, status
// Body: optional intro, then `## Learn` and `## Lesson` sections (see markdown.mjs)
//
// Output (deterministic, no timestamps): <outputDir>/index.json and <outputDir>/<id>.<lang>.json
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { ContentIssue, createMarkdown, renderSections } from './markdown.mjs';

export const LANGUAGES = ['en', 'ar'];
export const STATUSES = ['done', 'in-progress', 'planned'];
const META_KEYS = ['title', 'summary', 'order', 'status'];
const FILE_NAME = /^(?<id>[a-z0-9]+(?:-[a-z0-9]+)*)\.(?<lang>[a-z]{2})\.md$/;

export function parseFileName(fileName) {
  const match = FILE_NAME.exec(fileName);
  if (!match) {
    throw new ContentIssue(
      `File name must look like "<id>.<language>.md" with a lowercase id using letters, numbers and hyphens, for example "phase-01-typescript.en.md".`,
    );
  }
  const { id, lang } = match.groups;
  if (!LANGUAGES.includes(lang)) {
    throw new ContentIssue(
      `Unknown language "${lang}" in the file name. Supported languages: ${LANGUAGES.join(', ')}.`,
    );
  }
  return { id, lang };
}

export function parseFrontMatter(source) {
  const text = source.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const match = /^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(text);
  if (!match) {
    throw new ContentIssue(
      'The file must start with a front matter block: a line with "---", the fields title, summary, order and status, then another "---" line.',
    );
  }
  let data;
  try {
    data = YAML.parse(match[1]);
  } catch (error) {
    throw new ContentIssue(`The front matter is not valid YAML: ${error.message.split('\n')[0]}`);
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new ContentIssue('The front matter must be a list of "key: value" lines.');
  }
  return { data, body: text.slice(match[0].length) };
}

export function validateMeta(data) {
  const problems = [];
  for (const key of Object.keys(data)) {
    if (!META_KEYS.includes(key)) {
      problems.push(
        `Unknown front matter field "${key}". Allowed fields: ${META_KEYS.join(', ')}.`,
      );
    }
  }
  const text = (key, max) => {
    const value = data[key];
    if (typeof value !== 'string' || value.trim() === '') {
      problems.push(`"${key}" is required and must be non-empty text.`);
    } else if (value.length > max) {
      problems.push(`"${key}" is too long (${value.length} characters, maximum ${max}).`);
    }
  };
  text('title', 120);
  text('summary', 400);
  if (!Number.isInteger(data.order) || data.order < 0) {
    problems.push(
      '"order" is required and must be a whole number, 0 or more (for example 0, 1, 2).',
    );
  }
  if (!STATUSES.includes(data.status)) {
    problems.push(`"status" must be one of: ${STATUSES.join(', ')}.`);
  }
  if (problems.length > 0) {
    throw new ContentIssue(problems.join('\n'));
  }
  return {
    title: data.title.trim(),
    summary: data.summary.trim(),
    order: data.order,
    status: data.status,
  };
}

export function buildDocument(md, fileName, source) {
  const { id, lang } = parseFileName(fileName);
  const { data, body } = parseFrontMatter(source);
  const meta = validateMeta(data);
  const { intro, learn, lesson, toc } = renderSections(md, body);
  return { id, lang, ...meta, intro, learn, lesson, toc };
}

function writeIfChanged(file, content) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) {
    return;
  }
  fs.writeFileSync(file, content, 'utf8');
}

/**
 * Reads every file in `inputDir`, validates all of them, and writes the output only if every file
 * is valid. Returns { documents, phases } or throws a ContentIssue listing all problems.
 */
export function buildContent({ inputDir, outputDir }) {
  const md = createMarkdown();
  const problems = [];
  const documents = [];

  if (!fs.existsSync(inputDir)) {
    throw new ContentIssue(`The content folder does not exist: ${inputDir}`);
  }

  for (const entry of fs.readdirSync(inputDir, { withFileTypes: true })) {
    const name = entry.name;
    if (name.startsWith('.') || name.startsWith('_') || name.toLowerCase() === 'readme.md') {
      continue; // notes and drafts, never published
    }
    if (entry.isDirectory()) {
      problems.push(
        `${name}/: subfolders are not supported yet. Put the .md files directly in the content folder.`,
      );
      continue;
    }
    if (!name.toLowerCase().endsWith('.md')) {
      continue; // other file types are ignored
    }
    try {
      documents.push(buildDocument(md, name, fs.readFileSync(path.join(inputDir, name), 'utf8')));
    } catch (error) {
      if (!(error instanceof ContentIssue)) {
        throw error;
      }
      problems.push(`${name}: ${error.message.replaceAll('\n', '\n    ')}`);
    }
  }

  // Checks across files: the same phase in two languages must agree on order and status, and two
  // different phases must not share an order.
  const byId = new Map();
  const inLanguageOrder = [...documents].sort(
    (a, b) => a.id.localeCompare(b.id) || LANGUAGES.indexOf(a.lang) - LANGUAGES.indexOf(b.lang),
  );
  for (const doc of inLanguageOrder) {
    byId.set(doc.id, [...(byId.get(doc.id) ?? []), doc]);
  }
  const orderOwner = new Map();
  for (const [id, versions] of byId) {
    const first = versions[0];
    for (const other of versions.slice(1)) {
      if (other.order !== first.order || other.status !== first.status) {
        problems.push(
          `${id}: the ${first.lang} and ${other.lang} files disagree on order/status (${first.lang}: order ${first.order}, ${first.status}; ${other.lang}: order ${other.order}, ${other.status}). Make them match.`,
        );
      }
    }
    if (orderOwner.has(first.order)) {
      problems.push(
        `${id}: order ${first.order} is already used by "${orderOwner.get(first.order)}". Every phase needs its own order number.`,
      );
    } else {
      orderOwner.set(first.order, id);
    }
  }

  if (problems.length > 0) {
    throw new ContentIssue(problems.join('\n'));
  }

  const phases = [...byId.entries()]
    .map(([id, versions]) => {
      const first = versions[0];
      const sorted = [...versions].sort(
        (a, b) => LANGUAGES.indexOf(a.lang) - LANGUAGES.indexOf(b.lang),
      );
      return {
        id,
        order: first.order,
        status: first.status,
        languages: sorted.map((doc) => doc.lang),
        title: Object.fromEntries(sorted.map((doc) => [doc.lang, doc.title])),
        summary: Object.fromEntries(sorted.map((doc) => [doc.lang, doc.summary])),
      };
    })
    .sort((a, b) => a.order - b.order);

  fs.mkdirSync(outputDir, { recursive: true });
  const expected = new Set(['index.json']);
  writeIfChanged(path.join(outputDir, 'index.json'), `${JSON.stringify({ phases }, null, 2)}\n`);
  for (const doc of documents) {
    const fileName = `${doc.id}.${doc.lang}.json`;
    expected.add(fileName);
    writeIfChanged(path.join(outputDir, fileName), `${JSON.stringify(doc, null, 2)}\n`);
  }
  // Remove output for files that no longer exist (only .json files this script owns).
  for (const existing of fs.readdirSync(outputDir)) {
    if (existing.endsWith('.json') && !expected.has(existing)) {
      fs.rmSync(path.join(outputDir, existing));
    }
  }

  return { documents, phases };
}
