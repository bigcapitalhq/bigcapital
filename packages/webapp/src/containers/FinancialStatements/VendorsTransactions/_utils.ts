import * as Yup from 'yup';
import intl from 'react-intl-universal';
import moment from 'moment';

/**
 * 
 * @returns 
 */
export const getVendorTransactionsQuerySchema = () => {
  return Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('toDate')),
  });
};

/**
 * 
 * @returns {}
 */
export const getVendorsTransactionsDefaultQuery = () => ({
  fromDate: moment().toDate(),
  toDate: moment().toDate(),
  vendorsIds: [],
});
