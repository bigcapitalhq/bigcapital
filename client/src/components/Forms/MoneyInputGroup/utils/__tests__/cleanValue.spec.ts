import { cleanValue } from '../cleanValue';

describe('cleanValue', () => {
  it('should remove group separator in string', () => {
    expect(
      cleanValue({
        value: '1,000,000',
      })
    ).toEqual('1000000');
  });

  it('should handle period decimal separator in string', () => {
    expect(
      cleanValue({
        value: '1.000.000,12',
        decimalSeparator: ',',
        groupSeparator: '.',
      })
    ).toEqual('1000000,12');
  });

  it('should remove prefix', () => {
    expect(
      cleanValue({
        value: '£1000000',
        prefix: '£',
      })
    ).toEqual('1000000');

    expect(
      cleanValue({
        value: '$5.5',
        prefix: '$',
      })
    ).toEqual('5.5');
  });

  it('should remove extra decimals', () => {
    expect(
      cleanValue({
        value: '100.0000',
      })
    ).toEqual('100.00');
  });

  it('should remove decimals if not allowed', () => {
    expect(
      cleanValue({
        value: '100.0000',
        allowDecimals: false,
        decimalsLimit: 0,
      })
    ).toEqual('100');
  });

  it('should include decimals if allowed', () => {
    expect(
      cleanValue({
        value: '100.123',
        allowDecimals: true,
        decimalsLimit: 0,
      })
    ).toEqual('100.123');
  });

  it('should format value', () => {
    expect(
      cleanValue({
        value: '£1,234,567.89',
        prefix: '£',
      })
    ).toEqual('1234567.89');
  });

  describe('negative values', () => {
    it('should handle negative value', () => {
      expect(
        cleanValue({
          value: '-£1,000',
          decimalSeparator: '.',
          groupSeparator: ',',
          allowDecimals: true,
          decimalsLimit: 2,
          prefix: '£',
        })
      ).toEqual('-1000');
    });

    it('should handle negative value with decimal', () => {
      expect(
        cleanValue({
          value: '-£99,999.99',
          decimalSeparator: '.',
          groupSeparator: ',',
          allowDecimals: true,
          decimalsLimit: 2,
          prefix: '£',
        })
      ).toEqual('-99999.99');
    });

    it('should handle not allow negative value if allowNegativeValue is false', () => {
      expect(
        cleanValue({
          value: '-£1,000',
          decimalSeparator: '.',
          groupSeparator: ',',
          allowDecimals: true,
          decimalsLimit: 2,
          allowNegativeValue: false,
          prefix: '£',
        })
      ).toEqual('1000');
    });
  });

  it('should handle values placed before prefix', () => {
    expect(
      cleanValue({
        value: '2£1',
        prefix: '£',
      })
    ).toEqual('12');

    expect(
      cleanValue({
        value: '-2£1',
        prefix: '£',
      })
    ).toEqual('-12');

    expect(
      cleanValue({
        value: '2-£1',
        prefix: '£',
      })
    ).toEqual('-12');

    expect(
      cleanValue({
        value: '2-£1.99',
        prefix: '£',
        decimalsLimit: 5,
      })
    ).toEqual('-1.992');
  });

  describe('abbreviations', () => {
    it('should return empty string if abbreviation only', () => {
      expect(
        cleanValue({
          value: 'k',
          turnOffAbbreviations: true,
        })
      ).toEqual('');

      expect(
        cleanValue({
          value: 'm',
          turnOffAbbreviations: true,
        })
      ).toEqual('');

      expect(
        cleanValue({
          value: 'b',
          turnOffAbbreviations: true,
        })
      ).toEqual('');
    });

    it('should return empty string if prefix and abbreviation only', () => {
      expect(
        cleanValue({
          value: '$k',
          prefix: '$',
          turnOffAbbreviations: true,
        })
      ).toEqual('');

      expect(
        cleanValue({
          value: '£m',
          prefix: '£',
          turnOffAbbreviations: true,
        })
      ).toEqual('');
    });

    it('should ignore abbreviations if turnOffAbbreviations is true', () => {
      expect(
        cleanValue({
          value: '1k',
          turnOffAbbreviations: true,
        })
      ).toEqual('1');

      expect(
        cleanValue({
          value: '-2k',
          turnOffAbbreviations: true,
        })
      ).toEqual('-2');

      expect(
        cleanValue({
          value: '25.6m',
          turnOffAbbreviations: true,
        })
      ).toEqual('25.6');

      expect(
        cleanValue({
          value: '9b',
          turnOffAbbreviations: true,
        })
      ).toEqual('9');
    });
  });
});
