import ApiService from "services/ApiService";
import t from 'store/types';

export const fetchGeneralLedger = ({ query }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch({
      type: t.GENERAL_LEDGER_SHEET_LOADING,
      loading: true,
    });
    ApiService.get('/financial_statements/general_ledger', { params: query }).then((response) => {
      dispatch({
        type: t.GENERAL_LEDGER_STATEMENT_SET,
        data: response.data,
      });
      dispatch({
        type: t.GENERAL_LEDGER_SHEET_LOADING,
        loading: false,
      });
      resolve(response);
    }).catch((error) => { reject(error); });
  });
};

export const fetchBalanceSheet = ({ query }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch({
      type: t.SET_DASHBOARD_REQUEST_LOADING,
    });
    dispatch({
      type: t.BALANCE_SHEET_LOADING,
      loading: true,
    });
    ApiService.get('/financial_statements/balance_sheet', { params: query }).then((response) => {
      dispatch({
        type: t.BALANCE_SHEET_STATEMENT_SET,
        data: response.data,
        query: query,
      });
      dispatch({
        type: t.BALANCE_SHEET_LOADING,
        loading: false,
      });
      dispatch({
        type: t.SET_DASHBOARD_REQUEST_COMPLETED,
      });
      resolve(response);
    }).catch((error) => { reject(error); });
  });
};

export const fetchTrialBalanceSheet = ({ query }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch({
      type: t.TRIAL_BALANCE_SHEET_LOADING,
      loading: true,
    });
    ApiService.get('/financial_statements/trial_balance_sheet', { params: query }).then((response) => {
      dispatch({
        type: t.TRAIL_BALANCE_STATEMENT_SET,
        data: response.data,
      });
      dispatch({
        type: t.TRIAL_BALANCE_SHEET_LOADING,
        loading: false,
      });
      resolve(response.data);
    }).catch((error) => { reject(error); })
  })
};

export const fetchProfitLossSheet = ({ query }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch({
      type: t.PROFIT_LOSS_SHEET_LOADING,
      loading: true,
    }); 
    ApiService.get('/financial_statements/profit_loss_sheet', { params: query }).then((response) => {
      dispatch({
        type: t.PROFIT_LOSS_SHEET_SET,
        profitLoss: response.data.profitLoss,
        columns: response.data.columns,
        query: response.data.query,
      });
      dispatch({
        type: t.PROFIT_LOSS_SHEET_LOADING,
        loading: false,
      });
      resolve(response.data);
    }).catch((error) => { reject(error); });
  })
};

export const fetchJournalSheet = ({ query }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch({
      type: t.JOURNAL_SHEET_LOADING,
      loading: true,
    });
    ApiService.get('/financial_statements/journal', { params: query }).then((response) => {
      dispatch({
        type: t.JOURNAL_SHEET_SET,
        data: response.data,
        query: response.data.query,
      });
      dispatch({
        type: t.JOURNAL_SHEET_LOADING,
        loading: false,
      });
      resolve(response.data);
    }).catch(error => { reject(error); });
  });
};