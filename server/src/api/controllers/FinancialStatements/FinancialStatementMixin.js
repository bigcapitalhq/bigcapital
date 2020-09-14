

export const formatNumberClosure = (filter) => (balance) => {
  let formattedBalance = parseFloat(balance);

  if (filter.no_cents) {
    formattedBalance = parseInt(formattedBalance, 10);
  }
  if (filter.divide_1000) {
    formattedBalance /= 1000;
  }
  return formattedBalance;
};