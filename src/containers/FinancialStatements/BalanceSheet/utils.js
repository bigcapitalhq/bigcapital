import * as Yup from 'yup';
import intl from 'react-intl-universal';
import moment from 'moment';

export const getBalanceSheetHeaderDefaultValues = () => {
  return {
    basic: 'cash',
    filterByOption: 'without-zero-balance',
    displayColumnsType: 'total',
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
  };
};

export const getBalanceSheetHeaderValidationSchema = () =>
  Yup.object().shape({
    dateRange: Yup.string().optional(),
    fromDate: Yup.date().required().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('toDate')),
    filterByOption: Yup.string(),
    displayColumnsType: Yup.string(),
  });
