// @ts-nocheck
import moment from 'moment';

export const getDefaultQuery = () => {
  return {
    billableType: '',
    to_date: moment(new Date()).format('YYYY-MM-DD'),
  };
};
