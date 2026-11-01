interface SheetItem {
  items?: Record<string, unknown>[];
  total?: Record<string, unknown>;
}

export const purchasesByItemsReducer = (sheet: SheetItem) => {
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
