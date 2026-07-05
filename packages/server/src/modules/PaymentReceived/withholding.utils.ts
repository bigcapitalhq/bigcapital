interface WithholdingSettlementInput {
  /** Invoice total including tax. */
  total: number;
  /** Invoice subtotal excluding tax (the withholding base). */
  subtotalExcludingTax: number;
  /** The payment amount applied to the invoice. */
  paymentAmount: number;
  /** Customer withholding tax rate (percentage, 0-100). */
  withholdingTaxRate: number;
}

interface WithholdingSettlementResult {
  /** Whether the payment matches a net-of-withholding settlement. */
  applies: boolean;
  /** The withheld amount to book (residual so the invoice settles to zero). */
  withheldAmount: number;
}

const AMOUNT_TOLERANCE = 0.05;

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Detects whether a customer payment settles an invoice net of withholding
 * tax, and computes the withheld amount to book.
 *
 * Withholding (e.g. NZ schedular tax) is deducted by the payer from the
 * tax-exclusive amount: net = total - rate% * subtotalExcludingTax. When the
 * payment matches that net amount (within tolerance), the residual
 * (total - payment) should be booked against the withholding receivable
 * account so the invoice is fully settled.
 */
export const computeWithholdingSettlement = (
  input: WithholdingSettlementInput,
): WithholdingSettlementResult => {
  const { total, subtotalExcludingTax, paymentAmount, withholdingTaxRate } =
    input;

  if (!withholdingTaxRate || withholdingTaxRate <= 0) {
    return { applies: false, withheldAmount: 0 };
  }
  const expectedWithheld = round2(
    (withholdingTaxRate / 100) * subtotalExcludingTax,
  );
  const expectedNet = round2(total - expectedWithheld);

  if (Math.abs(paymentAmount - expectedNet) > AMOUNT_TOLERANCE) {
    return { applies: false, withheldAmount: 0 };
  }
  // Book the exact residual so rounding never leaves the invoice open.
  const withheldAmount = round2(total - paymentAmount);

  return { applies: withheldAmount > 0, withheldAmount };
};

/**
 * Computes the expected net-of-withholding amount for an invoice.
 * Used to surface net amounts as bank-match candidates.
 */
export const computeNetOfWithholding = (
  total: number,
  subtotalExcludingTax: number,
  withholdingTaxRate: number,
): number => {
  if (!withholdingTaxRate || withholdingTaxRate <= 0) return total;

  const expectedWithheld = round2(
    (withholdingTaxRate / 100) * subtotalExcludingTax,
  );
  return round2(total - expectedWithheld);
};
