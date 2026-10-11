import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src', import.meta.url));
const MIN_TOUCH = 48;
const interactiveStyle = /(button|chip|toggle|input|link|tab|search|back|remove|logout)/i;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory()
      ? walk(full)
      : full.endsWith('.tsx')
        ? [full]
        : [];
  });
}

function openingTags(source, name) {
  const tags = [];
  const pattern = new RegExp(`<${name}(?=[\\s>/])`, 'g');
  let match;
  while ((match = pattern.exec(source))) {
    let depth = 0;
    let index = match.index + name.length + 1;
    while (index < source.length) {
      const char = source[index];
      if (char === '{') depth += 1;
      else if (char === '}') depth -= 1;
      else if (char === '>' && depth === 0 && source[index - 1] !== '=') break;
      index += 1;
    }
    tags.push({
      text: source.slice(match.index, index + 1),
      line: source.slice(0, match.index).split('\n').length,
    });
  }
  return tags;
}

const problems = [];

for (const file of walk(root)) {
  const source = readFileSync(file, 'utf8');
  const rel = relative(root, file);

  for (const name of ['TouchableOpacity', 'Pressable']) {
    for (const tag of openingTags(source, name)) {
      if (!tag.text.includes('accessibilityRole')) {
        problems.push(`${rel}:${tag.line} ${name} sem accessibilityRole`);
      }
    }
  }

  for (const tag of openingTags(source, 'TextInput')) {
    if (!/accessibilityLabel|accessibilityLabelledBy/.test(tag.text)) {
      problems.push(`${rel}:${tag.line} TextInput sem accessibilityLabel/accessibilityLabelledBy`);
    }
  }

  for (const tag of openingTags(source, 'Image')) {
    if (!/accessibilityLabel|accessible=\{false\}/.test(tag.text)) {
      problems.push(`${rel}:${tag.line} Image sem accessibilityLabel nem accessible={false}`);
    }
  }

  let currentStyle = '';
  source.split('\n').forEach((text, index) => {
    const styleName = text.match(/^\s{2,4}([A-Za-z]+): \{/);
    if (styleName) currentStyle = styleName[1];
    const size = text.match(/^\s+(height|width): (\d+),/);
    if (size && Number(size[2]) < MIN_TOUCH && interactiveStyle.test(currentStyle)) {
      problems.push(`${rel}:${index + 1} estilo "${currentStyle}" com ${size[1]} ${size[2]} (< ${MIN_TOUCH})`);
    }
  });
}

if (problems.length === 0) {
  console.log('Nenhum problema encontrado.');
} else {
  console.log(problems.join('\n'));
  console.log(`\n${problems.length} problema(s).`);
  process.exitCode = 1;
}
