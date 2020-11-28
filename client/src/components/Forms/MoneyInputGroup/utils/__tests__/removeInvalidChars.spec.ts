import { removeInvalidChars } from '../removeInvalidChars';

describe('removeInvalidChars', () => {
  it('should remove letters in string', () => {
    expect(removeInvalidChars('1,000ab,0cd00.99', [',', '.'])).toEqual('1,000,000.99');
  });

  it('should remove special characters in string', () => {
    expect(removeInvalidChars('1.00ji0.0*&0^0', ['.'])).toEqual('1.000.000');
  });

  it('should keep abbreviations', () => {
    expect(removeInvalidChars('9k', ['k'])).toEqual('9k');
    expect(removeInvalidChars('1m', ['m'])).toEqual('1m');
    expect(removeInvalidChars('5b', ['b'])).toEqual('5b');
  });

  it('should keep abbreviations (case insensitive)', () => {
    expect(removeInvalidChars('9K', ['k'])).toEqual('9K');
    expect(removeInvalidChars('1M', ['m'])).toEqual('1M');
    expect(removeInvalidChars('5B', ['b'])).toEqual('5B');
  });
});
