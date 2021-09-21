import { isNumber } from '../isNumber';

describe('isNumber', () => {
  it('should return true for 0', () => {
    expect(isNumber('0')).toBe(true);
  });

  it('should return true for -3', () => {
    expect(isNumber('-3')).toBe(true);
  });

  it('should return true for 9', () => {
    expect(isNumber('9')).toBe(true);
  });

  it('should return true for abc1', () => {
    expect(isNumber('abc1')).toBe(true);
  });

  it('should return true for a.1', () => {
    expect(isNumber('a.1')).toBe(true);
  });

  it('should return false for space', () => {
    expect(isNumber(' ')).toBe(false);
  });

  it('should return false for comma', () => {
    expect(isNumber(',')).toBe(false);
  });

  it('should return false for period', () => {
    expect(isNumber('.')).toBe(false);
  });

  it('should return false for -', () => {
    expect(isNumber('-')).toBe(false);
  });

  it('should return false for +', () => {
    expect(isNumber('+')).toBe(false);
  });
});
