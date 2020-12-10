

export const formatNumber = (balance, { noCents, divideOn1000 }): string => {
  let formattedBalance: number = parseFloat(balance);

  if (noCents) {
    formattedBalance = parseInt(formattedBalance, 10);
  }
  if (divideOn1000) {
    formattedBalance /= 1000;
  }
  return formattedBalance;
};