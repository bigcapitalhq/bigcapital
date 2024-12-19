export const flatToNestedArray = (
  data,
  config = { id: 'id', parentId: 'parent_id' },
) => {
  const map = {};
  const nestedArray = [];

  data.forEach((item) => {
    map[item[config.id]] = item;
    map[item[config.id]].children = [];
  });

  data.forEach((item) => {
    const parentItemId = item[config.parentId];

    if (!item[config.parentId]) {
      nestedArray.push(item);
    }
    if (parentItemId) {
      map[parentItemId].children.push(item);
    }
  });
  return nestedArray;
};
