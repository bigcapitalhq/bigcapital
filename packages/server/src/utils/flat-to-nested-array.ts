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

    // An item whose parent is not in the list (for example a search that
    // matches a sub-account but not its parent) is shown at the top level
    // instead of crashing.
    if (parentItemId && map[parentItemId]) {
      map[parentItemId].children.push(item);
    } else {
      nestedArray.push(item);
    }
  });
  return nestedArray;
};
