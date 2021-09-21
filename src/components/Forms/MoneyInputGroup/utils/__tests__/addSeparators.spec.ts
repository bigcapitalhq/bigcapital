import { addSeparators } from '../addSeparators';

describe('Separators', () => {
  it('should add separator in string', () => {
    expect(addSeparators('1000000')).toEqual('1,000,000');
  });

  it('should use custom separator when provided', () => {
    expect(addSeparators('1000000', '.')).toEqual('1.000.000');
  });
});
