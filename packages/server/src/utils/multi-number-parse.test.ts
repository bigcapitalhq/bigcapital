import { assert } from 'chai';
import { multiNumberParse } from './multi-number-parse';

const correctNumbers = [
  { actual: '10.5', expected: 10.5 },
  { actual: '10,5', expected: 10.5 },
  { actual: '1.235,76', expected: 1235.76 },
  { actual: '2,543.56', expected: 2543.56 },
  { actual: '10 654.1234', expected: 10654.1234 },
  { actual: '2.654$10', expected: 2654.1 },
  { actual: '5.435.123,645', expected: 5435123.645 },
  { actual: '2,566,765.234', expected: 2566765.234 },
  { actual: '2,432,123$23', expected: 2432123.23 },
  { actual: '2,45EUR', expected: 2.45 },
  { actual: '4.78€', expected: 4.78 },
  { actual: '28', expected: 28 },
  { actual: '-48', expected: -48 },
  { actual: '39USD', expected: 39 },

  // Some negative numbers
  { actual: '-2,543.56', expected: -2543.56 },
  { actual: '-10 654.1234', expected: -10654.1234 },
  { actual: '-2.654$10', expected: -2654.1 },
];

const incorrectNumbers = [
  '10 345,234.21', // too many different separators
  '1.123.234,534,234', // impossible to detect where's the decimal separator
  '10.4,2', // malformed digit groups
  '1.123.2', // also malformed digit groups
];

describe('Test numbers', () => {
  correctNumbers.forEach((item) => {
    it(`"${item.actual}" should return ${item.expected}`, (done) => {
      const parsed = multiNumberParse(item.actual);
      assert.isNotNaN(parsed);
      assert.equal(parsed, item.expected);

      done();
    });
  });

  incorrectNumbers.forEach((item) => {
    it(`"${item}" should return NaN`, (done) => {
      assert.isNaN(numberParse(item));

      done();
    });
  });
});
