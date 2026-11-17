import { percentage, round, toNumber } from './number';

describe('AI assistant number helpers', () => {
  it('normalizes DECIMAL strings and empty values', () => {
    expect(toNumber('123.45')).toBe(123.45);
    expect(toNumber(null)).toBe(0);
    expect(toNumber(undefined)).toBe(0);
    expect(toNumber('not-a-number')).toBe(0);
  });

  it('rounds to two decimals by default', () => {
    expect(round('10.005')).toBe(10.01);
    expect(round(1.2345, 3)).toBe(1.235);
  });

  it('computes percentages and guards division by zero', () => {
    expect(percentage(25, 100)).toBe(25);
    expect(percentage(25, 0)).toBe(0);
  });
});
