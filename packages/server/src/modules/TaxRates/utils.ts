/**
 * Get inclusive tax amount.
 * @param {number} amount
 * @param {number} taxRate
 * @returns {number}
 */
export const getInclusiveTaxAmount = (amount: number, taxRate: number) => {
  return (amount * taxRate) / (100 + taxRate);
};

/**
 * Get exclusive tax amount.
 * @param {number} amount
 * @param {number} taxRate
 * @returns {number}
 */
export const getExlusiveTaxAmount = (amount: number, taxRate: number) => {
  return (amount * taxRate) / 100;
};
