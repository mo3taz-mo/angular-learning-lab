// Markdown renderer for lesson content.
//
// Safety: raw HTML in the Markdown source is NOT enabled (`html: false`), so `<script>` and friends
// are shown as text. markdown-it's default link validation also rejects `javascript:`, `vbscript:`,
// `file:` and non-image `data:` URLs. The only HTML in the output is produced by this file.
import MarkdownIt from 'markdown-it';

const SECTION_MARKERS = new Map([
  ['learn', 'learn'],
  ['lesson', 'lesson'],
]);

export class ContentIssue extends Error {}

function inlineText(inlineToken) {
  return (inlineToken.children ?? [])
    .filter((child) => child.type === 'text' || child.type === 'code_inline')
    .map((child) => child.content)
    .join('')
    .trim();
}

// Keeps letters and numbers from any script (Arabic headings get Arabic ids).
function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

// Gives every heading a unique id, so pages can link to sections.
function headingIds(state) {
  const used = new Map();
  state.tokens.forEach((token, index) => {
    if (token.type !== 'heading_open') {
      return;
    }
    const base = slugify(inlineText(state.tokens[index + 1]));
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    token.attrSet('id', count === 0 ? base : `${base}-${count + 1}`);
  });
}

// `- [ ] text` / `- [x] text` become read-only checkboxes. A real <input> is announced natively
// by assistive technology in the user's own language, so no extra wording is needed here.
function taskLists(state) {
  const { tokens } = state;
  const listStack = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open') {
      listStack.push(i);
    } else if (token.type === 'bullet_list_close' || token.type === 'ordered_list_close') {
      listStack.pop();
    } else if (
      token.type === 'inline' &&
      tokens[i - 1]?.type === 'paragraph_open' &&
      tokens[i - 2]?.type === 'list_item_open'
    ) {
      const first = token.children?.[0];
      const match = first?.type === 'text' ? /^\[([ xX])\]\s+/.exec(first.content) : null;
      if (!match) {
        continue;
      }
      first.content = first.content.slice(match[0].length);
      const checked = match[1] !== ' ';
      const box = new state.Token('html_inline', '', 0);
      box.content = `<input class="task-checkbox" type="checkbox" disabled${checked ? ' checked' : ''}> `;
      token.children.unshift(box);
      tokens[i - 2].attrJoin('class', 'task-list-item');
      const list = tokens[listStack[listStack.length - 1]];
      if (!(list.attrGet('class') ?? '').split(' ').includes('task-list')) {
        list.attrJoin('class', 'task-list');
      }
    }
  }
}

export function createMarkdown() {
  const md = new MarkdownIt({ html: false, linkify: true, typographer: false, breaks: false });

  md.core.ruler.push('heading_ids', headingIds);
  md.core.ruler.push('task_lists', taskLists);

  // Wide tables scroll sideways inside a focusable wrapper instead of breaking the page layout.
  md.renderer.rules.table_open = () => '<div class="table-wrap" tabindex="0"><table>\n';
  md.renderer.rules.table_close = () => '</table></div>\n';

  // Code is always left-to-right, even inside Arabic (RTL) pages.
  const codeBlock = (content, language) => {
    const languageClass = /^[\w+#.-]+$/.test(language) ? ` class="language-${language}"` : '';
    return `<pre class="code-block" dir="ltr"><code${languageClass}>${md.utils.escapeHtml(content)}</code></pre>\n`;
  };
  md.renderer.rules.fence = (tokens, index) => {
    const token = tokens[index];
    return codeBlock(token.content, token.info.trim().split(/\s+/)[0] ?? '');
  };
  md.renderer.rules.code_block = (tokens, index) => codeBlock(tokens[index].content, '');

  return md;
}

function isMarker(tokens, index) {
  const token = tokens[index];
  if (token.type !== 'heading_open' || token.tag !== 'h2' || token.level !== 0) {
    return null;
  }
  return SECTION_MARKERS.get(inlineText(tokens[index + 1]).toLowerCase()) ?? null;
}

function tableOfContents(tokens) {
  const entries = [];
  tokens.forEach((token, index) => {
    if (token.type === 'heading_open' && token.level === 0 && ['h2', 'h3'].includes(token.tag)) {
      entries.push({
        level: Number(token.tag.slice(1)),
        id: token.attrGet('id'),
        text: inlineText(tokens[index + 1]),
      });
    }
  });
  return entries;
}

/**
 * Renders a Markdown body into its sections.
 * - A leading `# Heading` is dropped (the title comes from the front matter).
 * - `## Learn` and `## Lesson` start a section; everything after belongs to it until the next
 *   marker. A marker may appear more than once; the pieces are joined in order.
 * - Content before the first marker is the intro. All other headings are kept as written.
 * - Any other `# Heading` is rejected, because every page already has one <h1>.
 */
export function renderSections(md, body) {
  const tokens = md.parse(body, {});

  let start = 0;
  if (tokens[0]?.type === 'heading_open' && tokens[0].tag === 'h1') {
    start = 3;
  }

  const groups = { intro: [], learn: [], lesson: [] };
  let current = 'intro';
  for (let i = start; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type === 'heading_open' && token.tag === 'h1' && token.level === 0) {
      throw new ContentIssue(
        `Found a second top-level heading "# ${inlineText(tokens[i + 1])}". Only one leading "# Title" is allowed (it is replaced by the front matter title); use "##" or lower.`,
      );
    }
    const marker = isMarker(tokens, i);
    if (marker) {
      current = marker;
      i += 2; // skip the marker's inline and closing tokens
      continue;
    }
    groups[current].push(token);
  }

  const result = { toc: {} };
  for (const name of Object.keys(groups)) {
    const html = md.renderer.render(groups[name], md.options, {}).trim();
    result[name] = html === '' ? null : html;
    if (name !== 'intro') {
      result.toc[name] = tableOfContents(groups[name]);
    }
  }
  return result;
}
