// @ts-nocheck

export const purchasesByItemsReducer = (sheet) => {
  const results = [];

  if (sheet.items) {
    sheet.items.forEach((item) => {
      results.push(item);
    });
  }
  if (sheet.total) {
    results.push({
      row_types: 'total',
      ...sheet.total,
    });
  }
  return results;
};
