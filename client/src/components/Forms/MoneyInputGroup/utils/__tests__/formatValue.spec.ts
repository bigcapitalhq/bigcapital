import { formatValue } from '../formatValue';

describe('formatValue', () => {
  it('should return empty if blank value', () => {
    expect(
      formatValue({
        value: '',
      })
    ).toEqual('');
  });

  it('should add separator', () => {
    expect(
      formatValue({
        value: '1234567',
      })
    ).toEqual('1,234,567');
  });

  it('should handle period separator', () => {
    expect(
      formatValue({
        value: '1234567',
        decimalSeparator: '.',
        groupSeparator: '.',
      })
    ).toEqual('1.234.567');
  });

  it('should handle comma separator for decimals', () => {
    expect(
      formatValue({
        value: '1234567,89',
        decimalSeparator: '.',
        groupSeparator: '.',
      })
    ).toEqual('1.234.567,89');
  });

  it('should handle - as separator for decimals', () => {
    expect(
      formatValue({
        value: '1234567-89',
        decimalSeparator: '-',
        groupSeparator: '.',
      })
    ).toEqual('1.234.567-89');
  });

  it('should handle empty decimal separator', () => {
    expect(
      formatValue({
        value: '1234567-89',
        decimalSeparator: '',
        groupSeparator: '.',
      })
    ).toEqual('1.234.567-89');
  });

  it('should NOT add separator if "turnOffSeparators" is true', () => {
    expect(
      formatValue({
        value: '1234567',
        turnOffSeparators: true,
      })
    ).toEqual('1234567');
  });

  it('should NOT add separator if "turnOffSeparators" is true even if decimal and group separators specified', () => {
    expect(
      formatValue({
        value: '1234567',
        decimalSeparator: '.',
        groupSeparator: ',',
        turnOffSeparators: true,
      })
    ).toEqual('1234567');
  });

  it('should add prefix', () => {
    expect(
      formatValue({
        value: '123',
        prefix: '£',
      })
    ).toEqual('£123');
  });

  it('should include "."', () => {
    expect(
      formatValue({
        value: '1234567.',
      })
    ).toEqual('1,234,567.');
  });

  it('should include decimals', () => {
    expect(
      formatValue({
        value: '1234.567',
      })
    ).toEqual('1,234.567');
  });

  it('should format value', () => {
    expect(
      formatValue({
        value: '1234567.89',
        prefix: '£',
      })
    ).toEqual('£1,234,567.89');
  });

  it('should handle 0 value', () => {
    expect(
      formatValue({
        value: '0',
        prefix: '£',
      })
    ).toEqual('£0');
  });

  describe('negative values', () => {
    it('should handle negative values', () => {
      expect(
        formatValue({
          value: '-1234',
          prefix: '£',
        })
      ).toEqual('-£1,234');
    });

    it('should return negative sign if only negative sign', () => {
      expect(
        formatValue({
          value: '-',
          prefix: '£',
        })
      ).toEqual('-');
    });
  });

  it('should handle negative value and "-" as groupSeparator', () => {
    expect(
      formatValue({
        value: '-1234',
        groupSeparator: '-',
        prefix: '£',
      })
    ).toEqual('-£1-234');
  });

  it('should handle negative value and "-" as decimalSeparator', () => {
    expect(
      formatValue({
        value: '-12-34',
        decimalSeparator: '-',
        prefix: '£',
      })
    ).toEqual('-£12-34');
  });

  it('should handle negative value and "-" as groupSeparator', () => {
    expect(
      formatValue({
        value: '-123456',
        groupSeparator: '-',
        prefix: '£',
      })
    ).toEqual('-£123-456');
  });
});
