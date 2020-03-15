import ApiService from "services/ApiService";
import t from 'store/types';

export const fetchExpensesList = ({ query }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get('expenses').then((response) => {
      dispatch({
        type: t.EXPENSES_LIST_SET,
        expenses: response.data.expenses,
      });
    }).catch(error => { reject(error); });
  });
};

export const fetchExpense = ({ id }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`expenses/${id}`).then((response) => {
      dispatch({
        type: t.EXPENSE_SET,
        expense: response.data.expense,
      });
    }).catch(error => { reject(error); });
  });
};

export const submitExpense = ({ form }) => {
  return (dispatch) => ApiService.post('expenses', { ...form });
};

export const editExpense = ({ form, id }) => {
  return (dispatch) => ApiService.post(`expensed/${id}`, form);
};

export const deleteExpense = ({ id }) => {
  return (dispatch) => ApiService.delete(`expenses/${id}`);
};

export const publishExpense = ({ id }) => {
  return (dispatch) => ApiService.post(`expenses/${id}/publish`);
};

