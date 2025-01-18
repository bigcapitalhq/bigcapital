/**
 * Calculate the running balance.
 * @param {number} amount - Transaction amount.
 * @param {number} lastRunningBalance - Last running balance.
 * @param {number} openingBalance - Opening balance.
 * @return {number} Running balance.
 */
export function calculateRunningBalance(
  amount: number,
  lastRunningBalance: number,
): number {
  return amount + lastRunningBalance;
}

export const getGeneralLedgerReportQuery = (
) => {
  return {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    basis: 'cash',
    numberFormat: {
      noCents: false,
      divideOn1000: false,
    },
    noneZero: false,
    accountsIds: [],
  };
};
