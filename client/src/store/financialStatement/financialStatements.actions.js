import ApiService from "services/ApiService";
import t from 'store/types';

export const fetchGeneralLedger = ({ query }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get('/financial_statements/general_ledger').then((response) => {
      dispatch({
        type: t.GENERAL_LEDGER_STATEMENT_SET,
        data: response.data,
      });
      resolve(response);
    }).catch((error) => { reject(error); });
  });
};

export const fetchBalanceSheet = ({ query }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get('/financial_statements/balance_sheet', { params: query }).then((response) => {
      dispatch({
        type: t.BALANCE_SHEET_STATEMENT_SET,
        data: response.data,
      });
      resolve(response);
    }).catch((error) => { reject(error); });
  });
};