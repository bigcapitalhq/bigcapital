import * as moment from 'moment';

export const HtmlTableCustomCss = `
table tr.row-type--total td{
  font-weight: 600;
}
table tr td:not(:first-child) {
  border-left: 1px solid #ececec;
}
table tr:last-child td {
  border-bottom: 1px solid #ececec; 
}
table .cell--credit,
table .cell--debit,
table .column--credit,
table .column--debit{
  text-align: right;
}
`;

export const getJournalSheetDefaultQuery = () => ({
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  fromRange: null,
  toRange: null,
  accountsIds: [],
  numberFormat: {
    noCents: false,
    divideOn1000: false,
  },
});
