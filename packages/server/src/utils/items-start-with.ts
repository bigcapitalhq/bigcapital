export const itemsStartWith = (items: string[], char: string) => {
  return items.filter((item) => item.indexOf(char) === 0);
};
