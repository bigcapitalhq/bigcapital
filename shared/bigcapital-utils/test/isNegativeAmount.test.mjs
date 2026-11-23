import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isNegativeAmount } from '../dist/index.mjs';

/**
 * Asserts `isNegativeAmount` returns `expected` for every given value.
 */
const expectEach = (values, expected) => {
  for (const value of values) {
    assert.equal(
      isNegativeAmount(value),
      expected,
      `isNegativeAmount(${
        typeof value === 'number' ? String(value) : JSON.stringify(value)
      })`,
    );
  }
};

test('treats negative numbers as negative', () => {
  expectEach([-1, -0.01, -1200], true);
});

test('treats zero, positive numbers and NaN as not negative', () => {
  expectEach([0, -0, 5, NaN], false);
});

test('recognises minus-signed amounts', () => {
  expectEach(['-$1,200.00', '-AED1,234.56', '-1,200', '-0.5'], true);
});

test('recognises parenthesised amounts', () => {
  expectEach(['($1,200.00)', '(1,200.00)'], true);
});

test('recognises negative percentages', () => {
  expectEach(['-%12.50', '-12.5%'], true);
});

test('accepts currency symbols with dots, slashes or dollar signs', () => {
  expectEach(['-Bs.F.1,000.00', '(S/.1,000.00)', '-MOP$5.00'], true);
});

test('ignores surrounding whitespace', () => {
  expectEach(['  -$1.00  ', ' ($1.00) '], true);
});

test('rejects positive amounts', () => {
  expectEach(['$1,200.00', '1,200.00', '%12.50'], false);
});

test('rejects text that is not a whole amount', () => {
  expectEach(
    [
      '',
      '-',
      '( )',
      '(Inactive) Account 2',
      'Total (net)',
      '-$1,200.00 CR',
      '--5',
    ],
    false,
  );
});

test('rejects amounts that round to zero', () => {
  expectEach(['-0.00', '(0.00)', '-$0.00', '-0'], false);
});

test('rejects values containing HTML', () => {
  expectEach(
    ['<span style="padding-left: 15px;"></span>-$50.00', '-$50.00</span>'],
    false,
  );
});

test('rejects values that are neither strings nor numbers', () => {
  expectEach([null, undefined, true, {}, []], false);
});
