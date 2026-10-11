import fs from 'node:fs';
import assert from 'node:assert/strict';

const dictionary = JSON.parse(fs.readFileSync('src/state/translations.json', 'utf8'));
const japanese = /[一-龯ぁ-んァ-ヶ]/;
const normalize = value => value.trim().replace(/\s+/g, ' ');
function translate(value, language) {
  if (language === 'ja' || !japanese.test(value)) return value;
  assert.ok(dictionary[normalize(value)], `Missing English translation: ${value}`);
  return dictionary[normalize(value)];
}
function render(value, language, depth = 0) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return translate(value, language).replaceAll('|', '\\|');
  if (typeof value !== 'object') return String(value);
  if ('ja' in value) {
    assert.ok(value.en, `Missing bilingual English: ${value.ja}`);
    return value[language];
  }
  if (Array.isArray(value)) return value.map(item => `${'  '.repeat(depth)}- ${render(item, language, depth + 1)}`).join('\n');
  return Object.entries(value).map(([key, item]) => {
    const complex = item && typeof item === 'object' && !('ja' in item);
    return `${'  '.repeat(depth)}- **${key}**:${complex ? '\n' : ' '}${render(item, language, depth + 1)}`;
  }).join('\n');
}
for (const language of ['ja', 'en']) {
  let output = language === 'ja'
    ? '# 掲載内容一覧（日本語）\n\nソースデータから自動生成。項目名はJSONと対応します。更新コマンド：`npm run docs:sync`。\n'
    : '# Published content (English)\n\nGenerated from source data and translations. Field names match the JSON files. Regenerate with `npm run docs:sync`.\n';
  for (const course of ['i', 'k']) {
    output += `\n## ${course === 'i' ? (language === 'ja' ? '電子コース' : 'Electronics course') : (language === 'ja' ? '国際コース' : 'International course')}\n`;
    for (const name of ['event', 'announcements', 'schedule', 'guide', 'companies', 'learning', 'sightseeing']) {
      const data = JSON.parse(fs.readFileSync(`src/data/${course}/${name}.json`, 'utf8'));
      if (name === 'guide') {
        assert.equal(new Set(data.documents.map(item => item.id)).size, data.documents.length, 'Duplicate document IDs');
        for (const document of data.documents) {
          assert.equal(typeof document.file, 'string');
          if (!document.file) continue;
          assert.ok(document.file.startsWith('pdfs/' + course + '/') && !document.file.includes('..') && /\.pdf$/i.test(document.file), 'Invalid PDF path: ' + document.file);
          assert.ok(fs.existsSync('public/' + document.file), 'Missing PDF: ' + document.file);
        }
      }
      output += `\n### ${name}\n\n${render(data, language)}\n`;
    }
  }
  const path = `docs/CONTENT.${language}.md`;
  if (process.argv.includes('--check')) assert.equal(fs.readFileSync(path, 'utf8'), output, `${path} is out of sync`);
  else fs.writeFileSync(path, output);
}
console.log('PASS: both courses have English data coverage; Japanese and English content documents are synchronized.');
