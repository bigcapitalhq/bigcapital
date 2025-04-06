
export const accumSum = (data: any[], callback: (data: any) => number): number => {
  return data.reduce((acc, _data) => {
    const amount = callback(_data);
    return acc + amount;
  }, 0);
};
