import tap from 'tap';
import '../lockdown.js';

const { test } = tap;

lockdown();

test('reject import expressions in evaluate', t => {
  const c = new Compartment();

  function wrap(s) {
    return `
      function name() {
        ${s};
        return a;
      }`;
  }

  const safe = `const a = 1`;
  const safe2 = `const a = notimport('evil')`;
  const safe3 = `const a = importnot('evil')`;

  const obvious = `const a = import('evil')`;
  const whitespace = `const a = import ('evil')`;
  const comment = `const a = import/*hah*/('evil')`;
  const doubleSlashComment = `const a = import // hah\n('evil')`;
  const newline = `const a = import\n('evil')`;
  const multiline = `\nimport('a')\nimport('b')`;

  t.doesNotThrow(() => c.evaluate(wrap(safe)), 'safe');
  t.doesNotThrow(() => c.evaluate(wrap(safe2)), 'safe2');
  t.doesNotThrow(() => c.evaluate(wrap(safe3)), 'safe3');
  t.throws(() => c.evaluate(wrap(obvious)), SyntaxError, 'obvious');
  t.throws(() => c.evaluate(wrap(whitespace)), SyntaxError, 'whitespace');
  t.throws(() => c.evaluate(wrap(comment)), SyntaxError, 'comment');
  t.throws(
    () => c.evaluate(wrap(doubleSlashComment)),
    SyntaxError,
    'doubleSlashComment',
  );
  t.throws(() => c.evaluate(wrap(newline)), SyntaxError, 'newline');
  t.throws(() => c.evaluate(wrap(multiline)), SyntaxError, 'multiline');

  t.end();
});

test('reject import expressions in Function', t => {
  const c = new Compartment();

  function wrap(s) {
    return `new Function("${s}; return a;")`;
  }

  const safe = `const a = 1`;
  const safe2 = `const a = notimport('evil')`;
  const safe3 = `const a = importnot('evil')`;

  const obvious = `const a = import('evil')`;
  const whitespace = `const a = import ('evil')`;
  const comment = `const a = import/*hah*/('evil')`;
  const doubleSlashComment = `const a = import // hah\n('evil')`;
  const newline = `const a = import\n('evil')`;
  const multiline = `\nimport('a')\nimport('b')`;

  t.doesNotThrow(() => c.evaluate(wrap(safe)), 'safe');
  t.doesNotThrow(() => c.evaluate(wrap(safe2)), 'safe2');
  t.doesNotThrow(() => c.evaluate(wrap(safe3)), 'safe3');
  t.throws(() => c.evaluate(wrap(obvious)), SyntaxError, 'obvious');
  t.throws(() => c.evaluate(wrap(whitespace)), SyntaxError, 'whitespace');
  t.throws(() => c.evaluate(wrap(comment)), SyntaxError, 'comment');
  t.throws(
    () => c.evaluate(wrap(doubleSlashComment)),
    SyntaxError,
    'doubleSlashComment',
  );
  t.throws(() => c.evaluate(wrap(newline)), SyntaxError, 'newline');
  t.throws(() => c.evaluate(wrap(multiline)), SyntaxError, 'multiline');

  t.end();
});
