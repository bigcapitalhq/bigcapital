import { omit, concat } from 'lodash';

export const nestedArrayToFlatten = (
  collection,
  property = 'children',
  parseItem = (a, level) => a,
  level = 1,
) => {
  const parseObject = (obj) =>
    parseItem(
      {
        ...omit(obj, [property]),
      },
      level,
    );

  return collection.reduce((items, currentValue, index) => {
    let localItems = [...items];
    const parsedItem = parseObject(currentValue);
    localItems.push(parsedItem);

    if (Array.isArray(currentValue[property])) {
      const flattenArray = nestedArrayToFlatten(
        currentValue[property],
        property,
        parseItem,
        level + 1,
      );
      localItems = concat(localItems, flattenArray);
    }
    return localItems;
  }, []);
};
