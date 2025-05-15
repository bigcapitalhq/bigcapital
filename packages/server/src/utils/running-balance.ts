

export const runningBalance = (amount: number) => {
  let runningBalance = amount;

  return {
    decrement: (decrement: number) => {
      runningBalance -= decrement;
    },
    increment: (increment: number) => {
      runningBalance += increment;
    },
    amount: () => runningBalance,
  };
};