/**
 * Calculate the running balance.
 * @param {number} amount - Transaction amount.
 * @param {number} lastRunningBalance - Last running balance.
 * @param {number} openingBalance - Opening balance.
 * @return {number} Running balance.
 */
export function calculateRunningBalance(
  amount: number,
  lastRunningBalance: number
): number {
  return amount + lastRunningBalance;
}
