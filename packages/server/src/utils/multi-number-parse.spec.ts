import { multiNumberParse } from './multi-number-parse';

describe('multiNumberParse', () => {
  it.each([
    ['5.00', 5],
    ['1,234.50', 1234.5],
    ['-150.25', -150.25],
    ['$5', 5],
    ['$50', 50],
    ['$1,234.50', 1234.5],
    ['-$5.00', -5],
    ['CA$5.00', 5],
    ['5,00 €', 5],
    ['(5.00)', -5],
    ['5-', -5],
    ['Rs.500', 500],
    ['$(5.00)', -5],
    ['$.50', 0.5],
  ])('parses %s', (input, expected) => {
    expect(multiNumberParse(input)).toBe(expected);
  });

  it.each(['5.00 CR', '5.00 DR'])('rejects %s', (input) => {
    expect(multiNumberParse(input)).toBeNaN();
  });
});
