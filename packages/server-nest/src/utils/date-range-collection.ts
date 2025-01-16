import * as moment from 'moment';

export const dateRangeCollection = (
  fromDate,
  toDate,
  addType: moment.unitOfTime.StartOf = 'day',
  increment = 1,
) => {
  const collection = [];
  const momentFromDate = moment(fromDate);
  let dateFormat = '';

  switch (addType) {
    case 'day':
    default:
      dateFormat = 'YYYY-MM-DD';
      break;
    case 'month':
    case 'quarter':
      dateFormat = 'YYYY-MM';
      break;
    case 'year':
      dateFormat = 'YYYY';
      break;
  }
  for (
    let i = momentFromDate;
    i.isBefore(toDate, addType) || i.isSame(toDate, addType);
    i.add(increment, `${addType}s`)
  ) {
    collection.push(i.endOf(addType).format(dateFormat));
  }
  return collection;
};

export const dateRangeFromToCollection = (
  fromDate: moment.MomentInput,
  toDate: moment.MomentInput,
  addType: moment.unitOfTime.StartOf = 'day',
  increment = 1,
) => {
  const collection = [];
  const momentFromDate = moment(fromDate);
  const dateFormat = 'YYYY-MM-DD';

  for (
    let i = momentFromDate;
    i.isBefore(toDate, addType) || i.isSame(toDate, addType);
    i.add(increment, `${addType}s`)
  ) {
    collection.push({
      fromDate: i.startOf(addType).format(dateFormat),
      toDate: i.endOf(addType).format(dateFormat),
    });
  }
  return collection;
};
