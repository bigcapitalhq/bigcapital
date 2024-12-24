import _ from 'lodash';

export const entriesAmountDiff = (
  newEntries,
  oldEntries,
  amountAttribute,
  idAttribute,
) => {
  const oldEntriesTable = _.chain(oldEntries)
    .groupBy(idAttribute)
    .mapValues((group) => _.sumBy(group, amountAttribute) || 0)
    .value();

  const newEntriesTable = _.chain(newEntries)
    .groupBy(idAttribute)
    .mapValues((group) => _.sumBy(group, amountAttribute) || 0)
    .mergeWith(oldEntriesTable, (objValue, srcValue) => {
      return _.isNumber(objValue) ? objValue - srcValue : srcValue * -1;
    })
    .value();

  return _.chain(newEntriesTable)
    .mapValues((value, key) => ({
      [idAttribute]: key,
      [amountAttribute]: value,
    }))
    .filter((entry) => entry[amountAttribute] != 0)
    .values()
    .value();
};
