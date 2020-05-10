// @flow

export const getCurrencyById = (currencies: Object, id: Integer) => {
  return Object.values(currencies).find(c => c.id == id) || null;
};

export const getCurrencyByCode = (currencies: Object, currencyCode: String) => {
  return currencies[currencyCode] || null;
};