


export const getARAgingSummaryDefaultQuery = () => { 
  return {
    asDate: moment().format('YYYY-MM-DD'),
      agingDaysBefore: 30,
      agingPeriods: 3,
      numberFormat: {
        divideOn1000: false,
        negativeFormat: 'mines',
        showZero: false,
        formatMoney: 'total',
        precision: 2,
      },
      customersIds: [],
      branchesIds: [],
      noneZero: false,
  };
};