


export const getItemsViewPages = (itemsViews, viewId) => {
  return itemsViews[viewId] ? 
    itemsViews[viewId].pages : {};
};