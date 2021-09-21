import { removeSeparators } from '../removeSeparators';

describe('removeSeparators', () => {
  it('should remove separators in string', () => {
    expect(removeSeparators('1,000,000')).toEqual('1000000');
  });

  it('should use custom separator when provided', () => {
    expect(removeSeparators('1.000.000', '.')).toEqual('1000000');
  });
});
