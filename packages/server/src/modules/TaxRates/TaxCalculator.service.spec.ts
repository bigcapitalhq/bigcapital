import { TaxCalculatorService, TaxRateInfo } from './TaxCalculator.service';

describe('TaxCalculatorService', () => {
  let service: TaxCalculatorService;

  beforeEach(() => {
    service = new TaxCalculatorService();
  });

  describe('calculateTaxes', () => {
    describe('with empty taxes', () => {
      it('should return empty array when taxes is null', () => {
        const result = service.calculateTaxes(100, null, false);
        expect(result).toEqual([]);
      });

      it('should return empty array when taxes is empty array', () => {
        const result = service.calculateTaxes(100, [], false);
        expect(result).toEqual([]);
      });
    });

    describe('with single non-compound tax (exclusive)', () => {
      it('should calculate tax correctly for 5% rate', () => {
        const taxes: TaxRateInfo[] = [
          { id: 1, rate: 5, isCompound: false, name: 'TPS', code: 'TPS' },
        ];
        const result = service.calculateTaxes(100, taxes, false);

        expect(result).toHaveLength(1);
        expect(result[0].taxRateId).toBe(1);
        expect(result[0].taxRate).toBe(5);
        expect(result[0].taxAmount).toBe(5);
        expect(result[0].taxableAmount).toBe(100);
      });

      it('should calculate tax correctly for 9.975% rate (TVQ)', () => {
        const taxes: TaxRateInfo[] = [
          { id: 2, rate: 9.975, isCompound: false, name: 'TVQ', code: 'TVQ' },
        ];
        const result = service.calculateTaxes(100, taxes, false);

        expect(result).toHaveLength(1);
        expect(result[0].taxRateId).toBe(2);
        expect(result[0].taxRate).toBe(9.975);
        expect(result[0].taxAmount).toBeCloseTo(9.975, 3);
        expect(result[0].taxableAmount).toBe(100);
      });

      it('should handle zero amount', () => {
        const taxes: TaxRateInfo[] = [
          { id: 1, rate: 5, isCompound: false },
        ];
        const result = service.calculateTaxes(0, taxes, false);

        expect(result).toHaveLength(1);
        expect(result[0].taxAmount).toBe(0);
        expect(result[0].taxableAmount).toBe(0);
      });
    });

    describe('with single non-compound tax (inclusive)', () => {
      it('should calculate tax correctly for 5% inclusive rate', () => {
        const taxes: TaxRateInfo[] = [
          { id: 1, rate: 5, isCompound: false, name: 'TPS', code: 'TPS' },
        ];
        // If price is 105 inclusive, base is 100, tax is 5
        const result = service.calculateTaxes(105, taxes, true);

        expect(result).toHaveLength(1);
        expect(result[0].taxAmount).toBe(5);
        expect(result[0].taxableAmount).toBe(105);
      });

      it('should calculate tax correctly for 9.975% inclusive rate (TVQ)', () => {
        const taxes: TaxRateInfo[] = [
          { id: 2, rate: 9.975, isCompound: false, name: 'TVQ', code: 'TVQ' },
        ];
        // Amount inclusive = 109.975, tax should be ~9.975
        const result = service.calculateTaxes(109.975, taxes, true);

        expect(result).toHaveLength(1);
        expect(result[0].taxAmount).toBeCloseTo(9.975, 2);
      });
    });

    describe('with multiple non-compound taxes (exclusive)', () => {
      it('should calculate TPS 5% and TVQ 9.975% on same base', () => {
        const taxes: TaxRateInfo[] = [
          { id: 1, rate: 5, isCompound: false, name: 'TPS', code: 'TPS' },
          { id: 2, rate: 9.975, isCompound: false, name: 'TVQ', code: 'TVQ' },
        ];
        const result = service.calculateTaxes(100, taxes, false);

        expect(result).toHaveLength(2);

        // TPS: 5% of 100 = 5
        expect(result[0].taxRateId).toBe(1);
        expect(result[0].taxAmount).toBe(5);
        expect(result[0].taxableAmount).toBe(100);

        // TVQ: 9.975% of 100 = 9.975
        expect(result[1].taxRateId).toBe(2);
        expect(result[1].taxAmount).toBeCloseTo(9.975, 3);
        expect(result[1].taxableAmount).toBe(100);
      });

      it('should calculate multiple taxes with different amounts', () => {
        const taxes: TaxRateInfo[] = [
          { id: 1, rate: 10, isCompound: false },
          { id: 2, rate: 5, isCompound: false },
          { id: 3, rate: 2.5, isCompound: false },
        ];
        const result = service.calculateTaxes(200, taxes, false);

        expect(result).toHaveLength(3);
        expect(result[0].taxAmount).toBe(20); // 10% of 200
        expect(result[1].taxAmount).toBe(10); // 5% of 200
        expect(result[2].taxAmount).toBe(5);  // 2.5% of 200
      });
    });

    describe('with compound taxes (exclusive)', () => {
      it('should calculate compound tax on base + previous taxes', () => {
        const taxes: TaxRateInfo[] = [
          { id: 1, rate: 10, isCompound: false, name: 'Tax1' },
          { id: 2, rate: 5, isCompound: true, name: 'Compound Tax' },
        ];
        const result = service.calculateTaxes(100, taxes, false);

        expect(result).toHaveLength(2);

        // First tax: 10% of 100 = 10
        expect(result[0].taxAmount).toBe(10);
        expect(result[0].taxableAmount).toBe(100);

        // Compound tax: 5% of (100 + 10) = 5.5
        expect(result[1].taxAmount).toBe(5.5);
        expect(result[1].taxableAmount).toBe(110);
      });

      it('should sort taxes with non-compound first, compound last', () => {
        const taxes: TaxRateInfo[] = [
          { id: 1, rate: 5, isCompound: true, name: 'Compound' },
          { id: 2, rate: 10, isCompound: false, name: 'Regular' },
        ];
        const result = service.calculateTaxes(100, taxes, false);

        // Non-compound should be calculated first
        expect(result[0].taxRateId).toBe(2); // Regular tax first
        expect(result[0].taxAmount).toBe(10);

        expect(result[1].taxRateId).toBe(1); // Compound tax second
        expect(result[1].taxAmount).toBe(5.5); // 5% of 110
      });

      it('should handle multiple compound taxes', () => {
        const taxes: TaxRateInfo[] = [
          { id: 1, rate: 10, isCompound: false },
          { id: 2, rate: 5, isCompound: true },
          { id: 3, rate: 2, isCompound: true },
        ];
        const result = service.calculateTaxes(100, taxes, false);

        expect(result).toHaveLength(3);

        // First tax: 10% of 100 = 10
        expect(result[0].taxAmount).toBe(10);

        // Second compound: 5% of 110 = 5.5
        expect(result[1].taxAmount).toBe(5.5);

        // Third compound: 2% of 115.5 = 2.31
        expect(result[2].taxAmount).toBeCloseTo(2.31, 2);
      });
    });

    describe('with compound taxes (inclusive)', () => {
      it('should calculate compound tax correctly for inclusive', () => {
        const taxes: TaxRateInfo[] = [
          { id: 1, rate: 10, isCompound: false },
          { id: 2, rate: 5, isCompound: true },
        ];
        const result = service.calculateTaxes(100, taxes, true);

        expect(result).toHaveLength(2);

        // For inclusive, non-compound uses base amount
        expect(result[0].taxableAmount).toBe(100);

        // For inclusive, compound uses base + non-compound tax
        const expectedCompoundTaxable = 100 + result[0].taxAmount;
        expect(result[1].taxableAmount).toBeCloseTo(expectedCompoundTaxable, 2);
      });
    });

    describe('precision handling', () => {
      it('should maintain precision for rates like 9.975%', () => {
        const taxes: TaxRateInfo[] = [
          { id: 1, rate: 9.975, isCompound: false },
        ];
        const result = service.calculateTaxes(60, taxes, false);

        // 9.975% of 60 = 5.985
        expect(result[0].taxAmount).toBeCloseTo(5.985, 3);
        expect(result[0].taxRate).toBe(9.975);
      });

      it('should handle very small amounts', () => {
        const taxes: TaxRateInfo[] = [
          { id: 1, rate: 5, isCompound: false },
        ];
        const result = service.calculateTaxes(0.01, taxes, false);

        expect(result[0].taxAmount).toBeCloseTo(0.0005, 4);
      });

      it('should handle large amounts', () => {
        const taxes: TaxRateInfo[] = [
          { id: 1, rate: 5, isCompound: false },
        ];
        const result = service.calculateTaxes(1000000, taxes, false);

        expect(result[0].taxAmount).toBe(50000);
      });
    });
  });

  describe('getTotalTaxAmount', () => {
    it('should return 0 for empty results', () => {
      const total = service.getTotalTaxAmount([]);
      expect(total).toBe(0);
    });

    it('should sum all tax amounts', () => {
      const taxResults = [
        { taxRateId: 1, taxRate: 5, taxAmount: 5, taxableAmount: 100 },
        { taxRateId: 2, taxRate: 9.975, taxAmount: 9.975, taxableAmount: 100 },
      ];
      const total = service.getTotalTaxAmount(taxResults);
      expect(total).toBeCloseTo(14.975, 3);
    });
  });

  describe('calculateAggregatedTaxes', () => {
    it('should return empty map for empty entries', () => {
      const result = service.calculateAggregatedTaxes([], false);
      expect(result.size).toBe(0);
    });

    it('should aggregate taxes from multiple entries', () => {
      const entries = [
        {
          amount: 100,
          taxes: [{ id: 1, rate: 5, isCompound: false }],
        },
        {
          amount: 200,
          taxes: [{ id: 1, rate: 5, isCompound: false }],
        },
      ];
      const result = service.calculateAggregatedTaxes(entries, false);

      expect(result.size).toBe(1);
      const tax = result.get(1);
      expect(tax.taxAmount).toBe(15); // 5 + 10
    });

    it('should aggregate multiple tax rates separately', () => {
      const entries = [
        {
          amount: 100,
          taxes: [
            { id: 1, rate: 5, isCompound: false },
            { id: 2, rate: 9.975, isCompound: false },
          ],
        },
        {
          amount: 100,
          taxes: [
            { id: 1, rate: 5, isCompound: false },
            { id: 2, rate: 9.975, isCompound: false },
          ],
        },
      ];
      const result = service.calculateAggregatedTaxes(entries, false);

      expect(result.size).toBe(2);
      expect(result.get(1).taxAmount).toBe(10); // 5 + 5
      expect(result.get(2).taxAmount).toBeCloseTo(19.95, 2); // 9.975 + 9.975
    });

    it('should handle entries with different taxes', () => {
      const entries = [
        {
          amount: 100,
          taxes: [{ id: 1, rate: 5, isCompound: false }],
        },
        {
          amount: 100,
          taxes: [{ id: 2, rate: 10, isCompound: false }],
        },
      ];
      const result = service.calculateAggregatedTaxes(entries, false);

      expect(result.size).toBe(2);
      expect(result.get(1).taxAmount).toBe(5);
      expect(result.get(2).taxAmount).toBe(10);
    });
  });
});
