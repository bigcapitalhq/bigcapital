
export const increment = (n: number = 0) => {
  let counter = n;

  return () => {
    counter += 1;
    return counter;
  };
};
