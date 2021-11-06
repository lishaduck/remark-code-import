const codeImport = require('./');
const remark = require('remark');
const path = require('path');

const input = q => `
\`\`\`js file=./__fixtures__/say-#-hi.js${q}
\`\`\`
`;

test('Basic file import', () => {
  expect(
    remark()
      .use(codeImport, {})
      .processSync({
        contents: input(''),
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "\`\`\`js file=./__fixtures__/say-#-hi.js
    console.log('Hello remark-code-import!');
    console.log('This is another line...');
    console.log('This is the last line');
    console.log('Oops, here is another');
    \`\`\`
    "
  `);
});

test('File import using line numbers', () => {
  expect(
    remark()
      .use(codeImport, {})
      .processSync({
        contents: input(`#L2-L3`),
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "\`\`\`js file=./__fixtures__/say-#-hi.js#L2-L3
    console.log('This is another line...');
    console.log('This is the last line');
    \`\`\`
    "
  `);
});

test('File import using single line number', () => {
  expect(
    remark()
      .use(codeImport, {})
      .processSync({
        contents: input('#L1'),
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "\`\`\`js file=./__fixtures__/say-#-hi.js#L1
    console.log('Hello remark-code-import!');
    \`\`\`
    "
  `);
});

test("Only following lines (e.g. #-L10) doesn't work", () => {
  expect(() => {
    remark()
      .use(codeImport, {})
      .processSync({
        contents: input('#-L2'),
        path: path.resolve('test.md'),
      })
      .toString();
  }).toThrow();
});

test('File import using single line number and following lines', () => {
  expect(
    remark()
      .use(codeImport, {})
      .processSync({
        contents: input('#L2-'),
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "\`\`\`js file=./__fixtures__/say-#-hi.js#L2-
    console.log('This is another line...');
    console.log('This is the last line');
    console.log('Oops, here is another');
    \`\`\`
    "
  `);
});

test('Preserve trailing newline and indentation', () => {
  expect(
    remark()
      .use(codeImport, { preserveTrailingNewline: true })
      .processSync({
        contents: input(''),
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "\`\`\`js file=./__fixtures__/say-#-hi.js
    console.log('Hello remark-code-import!');
    console.log('This is another line...');
    console.log('This is the last line');
    console.log('Oops, here is another');

    \`\`\`
    "
  `);

  expect(
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\`js file=./__fixtures__/indentation.js#L2-L3
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "\`\`\`js file=./__fixtures__/indentation.js#L2-L3
      console.log('indentation');
    	return 'indentation';
    \`\`\`
    "
  `);
});
