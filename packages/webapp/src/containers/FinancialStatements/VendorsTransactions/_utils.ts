import * as Yup from 'yup';
import intl from 'react-intl-universal';
import moment from 'moment';

/**
 * The validation schema of vendors transactions.
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
 * Retrieves the default query of vendors transactions.
 */
export const getVendorsTransactionsDefaultQuery = () => ({
  fromDate: moment().toDate(),
  toDate: moment().toDate(),
  vendorsIds: [],
});
