// @ts-nocheck

export const filterItemsByResourceType = (items, type) => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.filter((item) => item?._type === type);
};
