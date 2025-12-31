import { getInclusiveTaxAmount, getExlusiveTaxAmount } from './utils';

describe('Tax Utils', () => {
  describe('getExlusiveTaxAmount', () => {
    it('should calculate 5% tax on 100', () => {
      const result = getExlusiveTaxAmount(100, 5);
      expect(result).toBe(5);
    });

    it('should calculate 9.975% tax on 100 (TVQ)', () => {
      const result = getExlusiveTaxAmount(100, 9.975);
      expect(result).toBeCloseTo(9.975, 3);
    });

    it('should calculate 9.975% tax on 60', () => {
      const result = getExlusiveTaxAmount(60, 9.975);
      expect(result).toBeCloseTo(5.985, 3);
    });

    it('should return 0 for 0 amount', () => {
      const result = getExlusiveTaxAmount(0, 5);
      expect(result).toBe(0);
    });

    it('should return 0 for 0 rate', () => {
      const result = getExlusiveTaxAmount(100, 0);
      expect(result).toBe(0);
    });

    it('should handle decimal amounts', () => {
      const result = getExlusiveTaxAmount(99.99, 5);
      expect(result).toBeCloseTo(4.9995, 4);
    });

    it('should handle large amounts', () => {
      const result = getExlusiveTaxAmount(1000000, 5);
      expect(result).toBe(50000);
    });
  });

  describe('getInclusiveTaxAmount', () => {
    it('should calculate 5% inclusive tax on 105', () => {
      // If total is 105 and includes 5% tax, base is 100, tax is 5
      const result = getInclusiveTaxAmount(105, 5);
      expect(result).toBe(5);
    });

    it('should calculate 9.975% inclusive tax', () => {
      // If total is 109.975 and includes 9.975% tax
      const result = getInclusiveTaxAmount(109.975, 9.975);
      expect(result).toBeCloseTo(9.975, 2);
    });

    it('should return 0 for 0 amount', () => {
      const result = getInclusiveTaxAmount(0, 5);
      expect(result).toBe(0);
    });

    it('should return 0 for 0 rate', () => {
      const result = getInclusiveTaxAmount(100, 0);
      expect(result).toBe(0);
    });

    it('should handle 100% rate edge case', () => {
      // 100% rate means half of the amount is tax
      const result = getInclusiveTaxAmount(200, 100);
      expect(result).toBe(100);
    });

    it('should correctly extract tax from inclusive amount', () => {
      // For 10% inclusive: total = base + base*0.10 = base*1.10
      // If total is 110, base is 100, tax is 10
      const result = getInclusiveTaxAmount(110, 10);
      expect(result).toBe(10);
    });

    it('should handle Canadian tax scenario (TPS 5% + TVQ 9.975%)', () => {
      // Base: $100
      // TPS: $5 (5% of $100)
      // TVQ: $9.975 (9.975% of $100)
      // Total: $114.975

      const tpsAmount = getInclusiveTaxAmount(105, 5);
      expect(tpsAmount).toBe(5);

      const tvqAmount = getInclusiveTaxAmount(109.975, 9.975);
      expect(tvqAmount).toBeCloseTo(9.975, 2);
    });
  });

  describe('exclusive vs inclusive relationship', () => {
    it('should have consistent exclusive and inclusive calculations', () => {
      const baseAmount = 100;
      const taxRate = 5;

      // Exclusive: tax on base
      const exclusiveTax = getExlusiveTaxAmount(baseAmount, taxRate);
      expect(exclusiveTax).toBe(5);

      // Inclusive: extract tax from total (base + tax)
      const totalWithTax = baseAmount + exclusiveTax;
      const inclusiveTax = getInclusiveTaxAmount(totalWithTax, taxRate);
      expect(inclusiveTax).toBe(exclusiveTax);
    });

    it('should work with 9.975% rate (TVQ)', () => {
      const baseAmount = 60;
      const taxRate = 9.975;

      const exclusiveTax = getExlusiveTaxAmount(baseAmount, taxRate);
      const totalWithTax = baseAmount + exclusiveTax;
      const inclusiveTax = getInclusiveTaxAmount(totalWithTax, taxRate);

      expect(inclusiveTax).toBeCloseTo(exclusiveTax, 4);
    });
  });
});
