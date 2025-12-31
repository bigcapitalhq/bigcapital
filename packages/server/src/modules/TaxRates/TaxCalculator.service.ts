import { Injectable } from '@nestjs/common';
import { getExlusiveTaxAmount, getInclusiveTaxAmount } from './utils';

export interface TaxRateInfo {
  id: number;
  rate: number;
  isCompound: boolean;
  name?: string;
  code?: string;
}

export interface TaxCalculationResult {
  taxRateId: number;
  taxRate: number;
  taxAmount: number;
  taxableAmount: number;
  name?: string;
  code?: string;
}

@Injectable()
export class TaxCalculatorService {
  /**
   * Calculates taxes for a given amount with support for compound taxes.
   * Compound taxes are calculated on the amount + previous taxes.
   * Non-compound taxes are calculated on the base amount only.
   *
   * @param amount - Base amount to calculate taxes on
   * @param taxes - Array of tax rates (non-compound first, compound last)
   * @param isInclusiveTax - Whether taxes are inclusive in the amount
   * @returns Array of calculated tax results
   */
  public calculateTaxes(
    amount: number,
    taxes: TaxRateInfo[],
    isInclusiveTax: boolean,
  ): TaxCalculationResult[] {
    if (!taxes || taxes.length === 0) {
      return [];
    }

    // Sort taxes: non-compound first, then compound
    const sortedTaxes = [...taxes].sort((a, b) => {
      if (a.isCompound === b.isCompound) return 0;
      return a.isCompound ? 1 : -1;
    });

    const results: TaxCalculationResult[] = [];
    let runningTotal = amount;
    let totalNonCompoundTax = 0;

    for (const tax of sortedTaxes) {
      let taxAmount: number;
      let taxableAmount: number;

      if (isInclusiveTax) {
        // For inclusive tax, calculate based on the appropriate taxable amount
        taxableAmount = tax.isCompound
          ? amount + totalNonCompoundTax
          : amount;
        taxAmount = getInclusiveTaxAmount(taxableAmount, tax.rate);
      } else {
        // For exclusive tax, compound taxes are calculated on amount + previous taxes
        taxableAmount = tax.isCompound ? runningTotal : amount;
        taxAmount = getExlusiveTaxAmount(taxableAmount, tax.rate);
      }

      results.push({
        taxRateId: tax.id,
        taxRate: tax.rate,
        taxAmount,
        taxableAmount,
        name: tax.name,
        code: tax.code,
      });

      if (!tax.isCompound) {
        totalNonCompoundTax += taxAmount;
      }

      if (!isInclusiveTax) {
        runningTotal += taxAmount;
      }
    }

    return results;
  }

  /**
   * Calculates the total tax amount from an array of tax results.
   * @param taxResults - Array of tax calculation results
   * @returns Total tax amount
   */
  public getTotalTaxAmount(taxResults: TaxCalculationResult[]): number {
    return taxResults.reduce((sum, result) => sum + result.taxAmount, 0);
  }

  /**
   * Calculates taxes for multiple entries and returns aggregated results by tax rate.
   * @param entries - Array of entries with amount and taxes
   * @param isInclusiveTax - Whether taxes are inclusive
   * @returns Aggregated tax results by tax rate ID
   */
  public calculateAggregatedTaxes(
    entries: Array<{ amount: number; taxes: TaxRateInfo[] }>,
    isInclusiveTax: boolean,
  ): Map<number, TaxCalculationResult> {
    const aggregated = new Map<number, TaxCalculationResult>();

    for (const entry of entries) {
      const taxResults = this.calculateTaxes(
        entry.amount,
        entry.taxes,
        isInclusiveTax,
      );

      for (const result of taxResults) {
        const existing = aggregated.get(result.taxRateId);
        if (existing) {
          existing.taxAmount += result.taxAmount;
        } else {
          aggregated.set(result.taxRateId, { ...result });
        }
      }
    }

    return aggregated;
  }
}
